var Player = React.createClass({displayName: "Player",
 
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
    return this.currentVideo() ? this.currentVideo().media : "";
  },
  currentVideoImg: function() {
    if (this.currentVideo()) {
      return this.currentVideo().image;
    } 
    else if(this.props.entries[0]) {
      return this.props.entries[0]["thumbnail"];
    } 
    else {
      return "";
    }
  },
  currentAudioSrc: function() {
    return this.currentAudio() ? this.currentAudio().media : "";
  },

  videoShouldMute: function(){
    return this.currentVideo() ? !this.currentVideo().defined : false
  },

  showLoader: function() {
    if(this.refs.loader) {
      this.refs.loader.getDOMNode().className = "loader"
    }
  },

  hideLoader: function() {
    if(this.refs.loader) {
      this.refs.loader.getDOMNode().className = "loader hide"
    }
  },
  hidePlayButton: function() {
    if(this.refs.loader) {
      this.refs.button.getDOMNode().className = "playButton hide"
    }
  },
  canPlay: function() {
    var loaded = this.state.loadedAudio + this.state.loadedVideo;
    var target = this.props.entries.length + this.props.audioNeeded;
    return loaded === target 
  },

////////////////////////////////////////////////// 
// PRELOAD VIDEOS AND AUDIO
////////////////////////////////////////////////// 

  shouldComponentUpdate: function(nextProps, nextState) {
    // If there are new videos, load them
    var current = this.props.entries;
    var next = nextProps.entries;

    if (_.isEqual(current, next)) { 
      if(nextState.loadedVideo === 0) {
        this.preload(nextProps.entries);
      }
      return true;
    } 
    else if (this.state.loadedVideo !== 0) {
      this.setState(this.getInitialState()); 
      return false;
    } 
    else { 
      this.preload(nextProps.entries); 
      return true;
    }
  },

  preload: function(entries) {
    
    this.showLoader();
    this.hidePlayButton();
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
    var url;

    if(this.vidNode().canPlayType && this.vidNode().canPlayType('video/mp4').replace(/no/, '')) {
        url = entry["mp4"];
    } else {
        url = entry["webm"];
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
          videoPlaylist[i] = { media: media, defined: entry["defined"], image: entry["screenshot"] };
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
        var loaded = loadedVideo + loadedAudio;
        var loaded = this.state.loadedAudio + this.state.loadedVideo;
        var target = this.props.entries.length + this.props.audioNeeded;
   
        console.log("loaded " + loaded + "/" + target);
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

    // Check if done
    if (playIndex >= playlistLength) { 
      playIndex = 0; 
      this.refs.button.getDOMNode().className = "playButton"
    } 
    else { 
      playIndex += 1; 
      this.refs.button.getDOMNode().className = "playButton hide"
    }

    // Set bindings
    this.setVideoAudio();
    this.incrementWhenFinished(playIndex);
    this.audioNode().play();
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

  setVideoAudio: function() {
    if (this.videoShouldMute()) { 
      this.bindAudio(); 
      this.vidNode().muted = true;
    } else {
      this.vidNode().muted = false;
    }
  },

  bindAudio: function(){
    var player = this;
    player.$video().bind('start', function() {
      // playing audio bound to start of video
      //player.$video().unbind('start');
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

  replay: function() {
    var player = this;
    if (this.state.playIndex === 0) {
      this.playMashup(); 
    } else {
      //Replay
      this.setState({
        videoPlaylist: this.state.videoPlaylist,
        audioPlaylist: this.state.audioPlaylist,
        playIndex: 0,
        loadedVideo: this.state.loadedVideo,
        loadedAudio: this.state.loadedAudio
      });
      window.setTimeout(function() { 
        // playMashup runs but doesn't play the video
        // but it's all set up to run, we just need to call it
        // after the event listeners are set
        var button = player.refs.button.getDOMNode();
        button.click();
      }, 100);
      // END HACKY CODE
    }
  },


  //////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////
  render: function() {
    var loader = "loader";
    var button = "playButton hide"

    // show poster
    var poster = this.currentVideoImg();
    if(poster === undefined && this.props.entries.length > 0) {
      poster = this.props.entries[0]["screenshot"];
    }

    // show playbutton
    if (this.canPlay()) { 
      if (this.vidNode()) { 
        if(this.state.playIndex > 0) {
          this.playMashup(); 
        } 
        else {
          button = "playButton"
        }
      }
      loader = "loader hide";
    } 

    return (
      React.createElement("div", {idName: "player"}, 
        React.createElement("video", {ref: "video", src: this.currentVideoSrc(), poster: poster, type: "video/mp4", id: "master-vid"}), 
        React.createElement("audio", {ref: "audio", src: this.currentAudioSrc()}), 
        React.createElement("div", {ref: "loader", className: loader}), 
        React.createElement("div", {ref: "button", className: button, onClick: this.replay}, 
          React.createElement("img", {src: "./assets/play.svg"})
        )
      )
    );
  }
});
