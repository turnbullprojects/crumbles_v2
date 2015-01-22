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
      console.log(this.currentVideo().image);
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
          videoPlaylist[i] = { media: media, defined: entry["defined"], image: entry["thumbnail"] };
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

    console.log("play mashup");
    // Check if done
    if (playIndex >= playlistLength) { 
      console.log("play index bigger than length");
      playIndex = 0; 
      this.refs.button.getDOMNode().className = "playButton"
    } 
    else { 
      console.log("play index increment");
      playIndex += 1; 
      this.refs.button.getDOMNode().className = "playButton hide"
    }

    // Set bindings
    this.setVideoAudio();
    this.incrementWhenFinished(playIndex);
    this.audioNode().play();
    console.log("about to play " + this.vidNode().src);
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
    console.log("binding audio");
    var player = this;
    player.$video().bind('start', function() {
      console.log("video start event");
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
    this.setState({
      videoPlaylist: this.state.videoPlaylist,
      audioPlaylist: this.state.audioPlaylist,
      playIndex: 0,
      loadedVideo: this.state.loadedVideo,
      loadedAudio: this.state.loadedAudio
    });
    // ALERT: HACKY FUCKING CODE RIGHT HERE
    window.setTimeout(function() { 
      // playMashup runs but doesn't play the video
      // but it's all set up to run, we just need to call it
      // after the event listeners are set
      player.vidNode().play();
    }, 500);
    // END HACKY CODE
  },


  //////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////
  render: function() {
    console.log("rendering");
    if (this.canPlay()) { 
      console.log("can play");
      if (this.vidNode()) { this.playMashup(); }
    } 
    return (
      React.createElement("div", {idName: "player"}, 
        React.createElement("video", {ref: "video", src: this.currentVideoSrc(), poster: this.currentVideoImg(), type: "video/mp4", id: "master-vid"}), 
        React.createElement("audio", {ref: "audio", src: this.currentAudioSrc()}), 
        React.createElement("div", {ref: "button", className: "playButton hide", onClick: this.replay}, 
          React.createElement("img", {src: "./assets/play.svg"})
        )
      )
    );
  }
});
