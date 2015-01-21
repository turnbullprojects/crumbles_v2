
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
  
  shouldComponentUpdate: function(nextProps, nextState) {

    var current = this.props.entries;
    var next = nextProps.entries;

    if (_.isEqual(current, next)) {
      return true;
    } else {
      this.preload();
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

    // MP4 if it plays it, WebM if not
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

  canPlay: function() {
    var loaded = this.state.loadedAudio + this.state.loadedVideo;
    console.log("loaded: " + loaded);
    var target = this.props.entries.length + this.props.audioNeeded;
    console.log("target: " + target);
    return loaded === target 
  },

  playMashup: function() {
    var playIndex = this.state.playIndex;

    // Set new index
    if (playIndex >= videoPlaylist.length) { playIndex = 0; } 
    else { playIndex += 1; }

    // Set bindings
    if (this.videoHasSeparateAudio()) { this.bindAudio(); } 
    this.incrementWhenFinished(playIndex);
  },

  incrementWhenFinished: function(playIndex) {
    var player = this;
    player.$video.bind('ended', function () {
      player.$video.unbind('ended');
      player.incrementIndices(playIndex);
    });
  },

  bindAudio: function(){
    var player = this;
     player.$video.bind('start', function() {
        player.$video.unbind('start');
        player.audioNode().play();
      });
  },

  audioNode: function() {
    if(this.refs.audio){ return this.refs.audio.getDOMNode(); }
  },

  vidNode: function() {
    if(this.refs.video) { return this.refs.video.getDOMNode(); }
  },
  $video: function() {
    return $('#' + vidNode().id);
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
  render: function() {
    console.log("calling render");
    if (this.canPlay()) { 
      console.log("can play");
      if (this.vidNode()) { this.vidNode().play(); }
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
