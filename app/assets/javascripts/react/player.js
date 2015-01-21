
var Player = React.createClass({
 
  getInitialState: function() {
    return { 
      videoPlaylist: [], 
      audioPlaylist: [],
      playIndex: 0,
      loadedVideo: 0,
      loadedAudio: 0
    };
  },
  
  ////////////////////////////////////////////////// 
  // DOM HELPERS
  ////////////////////////////////////////////////// 
  audioNode: function() {
    if(this.refs.audio){ return this.refs.audio.getDOMNode(); }
  },
  vidNode: function() {
    if(this.refs.video) { return this.refs.video.getDOMNode(); }
  },
  $video: function() {
    return $('#' + this.vidNode().id);
  },

  ////////////////////////////////////////////////// 
  // STATE HELPERS
  ////////////////////////////////////////////////// 

  currentVideo: function() {
    var playlist = this.state.videoPlaylist;
    var index = this.state.playIndex;
    return playlist[index];
  },
  currentAudio: function() {
      var playlist = this.state.audioPlaylist;
      var index = this.state.playIndex;
      return playlist[index];
  },
  currentVideoSrc: function() {
    if (this.currentVideo()) { return this.currentVideo().media; } 
    else { return ""; }
  },
  currentAudioSrc: function() {
    if (this.currentAudio()) { return this.currentAudio().media; }
    else { return ""; }
  },
  videoHasSeparateAudio: function(){
    if(this.currentVideo())
      return !this.currentVideo().defined
  },

  canPlay: function() {
    var loaded = this.state.loadedAudio + this.state.loadedVideo;
    console.log("loaded: " + loaded);
    var target = this.props.entries.length + this.props.audioNeeded;
    console.log("target: " + target);
    return loaded === target 
  },

  ////////////////////////////////////////////////// 
  // PRELOAD VIDEOS AND AUDIO
  ////////////////////////////////////////////////// 

  shouldComponentUpdate: function(nextProps, nextState) {
    // If there are new videos, load them
    var current = this.props.entries;
    var next = nextProps.entries;

    console.log("running should component update");
    if (_.isEqual(current, next)) { 
      console.log("is equal. Current loadedVideo count is " + this.state.loadedVideo + " and next is " + nextState.loadedVideo);
      if(nextState.loadedVideo === 0) {
        console.log("preload running because we got nothing");
        this.preload(nextProps.entries);
      }
      return true;
    } 
    else if (this.state.loadedVideo !== 0) {
      console.log("Needs to be reset before rerender")
      // reset state, will trigger a rerender and load next iteration
      this.setState(this.getInitialState()); 
      return false;
    } 
    else { 
      console.log("Preloading...");
      this.preload(nextProps.entries); 
      return true;
    }
  },

  preload: function(entries) {
    console.log("Preloading for " + entries.length + " entries");
    for(var i=0; i < entries.length; i++) {
      var entry = entries[i];
      if (!entry["defined"]) {
        this.getAudio(entry, i); // if entry isn't in dictionary, we need audio
      }
      this.getVideo(entry, i); // we always need video
    }
  },

  getAudio: function(entry, i) {
    var word = encodeURIComponent(entry["word"]);
    var url = "./tts/m/" + word;
    this.getMedia(url, entry, i, false);
  },

  getVideo: function(entry, i) {
    var url = entry["video_url"];

    if(this.vidNode().canPlayType && this.vidNode().canPlayType('video/mp4').replace(/no/, '')) {
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
        var loadedVideo = player.state.loadedVideo;
        var loadedAudio = player.state.loadedAudio;

        if (video) {
          videoPlaylist[i] = { media: media, defined: entry["defined"] };
          loadedVideo += 1;
        } else {
          audioPlaylist[i] = { media: media, defined: entry["defined"] };
          loadedAudio += 1;
        }
        player.setState({
          videoPlaylist: videoPlaylist,
          audioPlaylist: audioPlaylist,
          playIndex: 0,
          loadedVideo: loadedVideo,
          loadedAudio: loadedAudio
        });
      }
    }
    xhr.send();
  },

  //////////////////////////////////////////////////  
  // PLAY FUNCTIONALITY
  //////////////////////////////////////////////////  
  playMashup: function() {
    var playIndex = this.state.playIndex;
    var playlistLength = this.state.videoPlaylist.length;

    // Set new index
    if (playIndex >= this.state.videoPlaylist) { playIndex = 0; } 
    else { playIndex += 1; }

    // Set bindings
    if (this.videoHasSeparateAudio()) { this.bindAudio(); } 
    this.incrementWhenFinished(playIndex);
    this.vidNode().play();
  },

  incrementWhenFinished: function(playIndex) {
    var player = this;
    player.$video().bind('ended', function () {
      // binding video
      player.$video().unbind('ended');
      player.incrementIndices(playIndex);
      player.playMashup();
    });
  },

  bindAudio: function(){
    var player = this;
     player.$video().bind('start', function() {
        // playing audio bound to start of video
        player.$video().unbind('start');
        player.audioNode().play();
      });
  },
  incrementIndices: function(playIndex) {
      this.setState({
        videoPlaylist: this.state.videoPlaylist,
        audioPlaylist: this.state.audioPlaylist,
        playIndex: playIndex,
        loadedVideo: this.state.loadedVideo,
        loadedAudio: this.state.loadedAudio
      });
  },

  //////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////
  render: function() {
    console.log("Rendering");
    if (this.canPlay()) { 
      console.log("can play");
      if (this.vidNode()) { this.playMashup(); }
    } else {
      console.log("can't play");
    }
    return (
      <div idName="player">
        <video ref='video' src={this.currentVideoSrc()} mute={this.videoHasSeparateAudio()} type='video/mp4' id='master-vid'></video>
        <audio ref="audio" src={this.currentAudioSrc()}></audio>
      </div>
    );
  }
});
