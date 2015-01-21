
var Player = React.createClass({

  getInitialState: function() {
    return { 
      canPlay: false,
      videoPlaylist: [], 
      audioPlaylist: [],
      videosPlayed: [],
      audioPlayed: [],
      loadedVideo: 0,
      loadedAudio: 0
    };
  },
  
  shouldComponentUpdate: function(nextProps, nextState) {
    // This function stops render action 
    // if there has not been a change

    var current = this.props.entries;
    var next = nextProps.entries;

    if (_.isEqual(current, next)) {
      return false; // don't render
    } else {
      // update state to reflect 0 loaded
      this.setState({
        canPlay: false,
        videoPlaylist: [],
        audioPlaylist: [],
        videosPlayed: [],
        audioPlayed: [],
        loadedVideo: 0,
        loadedAudio: 0
      });
      return true; // do render
    }
  },

  preload: function() {
    
    var entries = this.props.entries;
    console.log("Preloading for " + entries.length + " entries");
    for(var i=0; i < entries.length; i++) {

      var entry = entries[i];

      if (!entry["defined"]) {
        // if entry isn't in dictionary, we need audio
        this.getAudio(entry, i);
      }
      // we always need video
      this.getVideo(entry, i);
    }
  },

  getAudio: function(entry, i) {
    var word = encodeURIComponent(entry["word"]);
    var url = "./tts/m/" + word;
    this.getMedia(url, entry, i, false);
  },

  getVideo: function(entry, i) {
    var url = entry["video_url"];
    var vidTag = this.refs.video.getDOMNode();

    // MP4 if it plays it, WebM if not
    if(vidTag.canPlayType && vidTag.canPlayType('video/mp4').replace(/no/, '')) {
        url = url + ".mp4";
    } else {
        url = url + ".webm";
    }
    this.getMedia(url, entry, i, true);
  },

  getMedia: function(url, entry, i, video) {
    // Capture context
    var player = this;

    // set up our request
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.dataType = 'jsonp';


    xhr.onload = function(e) {
      if (this.status == 200) {
        // getting raw blob of data
        // is only way to ensure all are fully downloaded
        var myBlob = this.response;
        var media = (window.webkitURL ? webkitURL : URL).createObjectURL(myBlob);

        // Add to playlist
        var videoPlaylist = player.state.videoPlaylist;
        var audioPlaylist = player.state.audioPlaylist;

        var loadedVideo, loadedAudio;
        if (video) {
          // Update video playlist & count
          videoPlaylist[i] = { media: media, defined: entry["defined"] };
          loadedVideo = player.state.loadedVideo + 1;
          // Audio unchanged
          loadedAudio = player.state.loadedAudio;
        } else {
          // Update audio & count
          audioPlaylist[i] = { media: media, defined: entry["defined"] };
          loadedAudio = player.state.loadedAudio + 1;
          // Video Unchanged
          loadedVideo = player.state.loadedVideo;
        }

        // Total needed before we can play
        var loaded = loadedAudio + loadedVideo;
        var target = player.props.entries.length + player.props.audioNeeded;


        if(loaded === target) { 
          // Everything is loaded! 
          console.log("loaded up");
          
          // Audio Playlist is in the rightorder, 
          // but it holds nil for the empy values
          audioPlaylist = _.compact(audioPlaylist);

          // Set canPlay to true and play
          player.setState({
            canPlay: true,
            videoPlaylist: videoPlaylist,
            audioPlaylist: audioPlaylist,
            videosPlayed: [],
            audioPlayed: [],
            loadedVideo: loadedVideo,
            loadedAudio: loadedAudio
          });

          var vidTag = player.refs.video.getDOMNode();
          vidTag.poster = player.props.entries[0]["thumbnail"];
          console.log("end of this, canPlay is: " + player.state.canPlay);
          player.refs.btn.getDOMNode().className = "active"

        } else if (loaded < target) {
          // Still more to load...
          player.setState({
            canPlay: false,
            videoPlaylist: videoPlaylist,
            audioPlaylist: audioPlaylist,
            videosPlayed: [],
            audioPlayed: [],
            loadedVideo: loadedVideo,
            loadedAudio: loadedAudio
          });
        } else { 
          // Something went wrong
        }
       }
    }
    xhr.send();

  },

  playOrReplay: function(){
    console.log("Play or Replay");
    if(this.state.canPlay === true) {
      if(this.state.videoPlaylist.count > 0) {
        this.playMashup();
      } 
      else {
        // Move from played to playlist
        this.setState({
          canPlay: true,
          videoPlaylist: this.state.videosPlayed,
          audioPlaylist: this.state.audioPlayed,
          videosPlayed: [],
          audioPlayed: [],
          loadedVideo: this.state.loadedVideo,
          loadedAudio: this.state.loadedAudio
        });
        // then play 
        this.playMashup();
      }
    }
  },

  playMashup: function() {
    var player = this;
    var currentAudio, currentVideo;
    var audioPlaylist = player.state.audioPlaylist;
    var audioPlayed = player.state.audioPlayed;
    var videoPlaylist = player.state.videoPlaylist;
    var videosPlayed = player.state.videosPlayed;
    var vidTag = player.refs.video.getDOMNode();

    var $video = $('#' + vidTag.id);

    if (videoPlaylist.length > 0) {

      // Video playlist is our master counter
      // take the first off and move it to played
      var currentVideo = videoPlaylist.shift();
      videosPlayed.push(currentVideo);

      // Set new video source

      vidTag.src = currentVideo.media;

      // If not in dictionary, we need audio
      if (!currentVideo.defined) {
        vidTag.muted = true;
        currentAudio = audioPlaylist.shift();
        audioTag = player.refs.audio.getDOMNode();
        audioTag.src = currentAudio.media;
        audioTag.play();
        // Bind audio to play in sync with video
        $video.bind('start', function() {
          $video.unbind('start');
          audioTag.play();
        });
      } else {
        vidTag.muted = false;
      }

      // Bind to play next after this has ended
      $video.bind('ended', function () {
        //$video.unbind('start');
        $video.unbind('ended');
        player.playMashup();
      });

      // Save State
      this.setState({
        canPlay: true,
        videoPlaylist: videoPlaylist,
        audioPlaylist: this.state.audioPlaylist,
        videosPlayed: videosPlayed,
        audioPlayed: this.state.audioPlayed,
        loadedVideo: this.state.loadedVideo,
        loadedAudio: this.state.loadedAudio
      });

      // Go
      vidTag.play();

    } else {
      console.log("Nothing left in playlist");
    }
  },

  render: function() {
    this.preload();
    return (
      <div idName="playerAndControls" >
        <div idName="player">
          <video ref='video' type='video/mp4' id='master-vid'></video>
          <audio ref="audio"></audio>
        </div>
        <div idName="controls">
          <div ref="btn" id="play-btn" className="inactive" onClick={this.playOrReplay}>
            Play
          </div>

        </div>
      </div>
    );
  }
});
