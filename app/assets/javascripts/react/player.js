var MashupContainer = React.createClass({

  getInitialState: function() { 
    return { 
      phrase: []
    } 
  },
 
  handlePhraseInput: function(words) {
    console.log(words);

    var oldPhrase = this.state.phrase;
    var newPhrase = [];
    var samePhrase = true;

    for (var i=0; i < words.length; i++) {
      var word = words[i];
      if(oldPhrase[i] && word === oldPhrase[i]["word"]) {
        newPhrase.push(oldPhrase[i]);
      } else {
        entry = this.findInDictionary(StandardDict, word);
        newPhrase.push(entry);
        samePhrase = false;
      }
    };
    if(!samePhrase) {
      this.setState({ phrase: newPhrase });
      console.log(this.state.phrase);
    }
  },

  findInDictionary: function(dictionary, word) {
    var entry = dictionary["entries"][word]
    if (entry != undefined) {
      entry["defined"] = true;
      return entry;
    } else {
      console.log("not in dictionary");
      return this.notInDictionary(dictionary);
    }
  },

  notInDictionary: function(dictionary) {
    var randomVideo = dictionary["entries"]["duck"];
    randomVideo["defined"] = false;
    return randomVideo;
  },

  render: function() {
    var entries = [];

    return (
      <div idName="mashup-container">
        <PhraseInput onInput={this.handlePhraseInput} />
        <Player entries={this.state.phrase} />
      </div>
    );
  }
});

var PhraseInput = React.createClass({

  updateUrl: function(words) {
    var newPhrase = encodeURIComponent(words);

    var params = _.chain( window.location.search.slice(1).split('&') )
                  .map(function(item) { if (item) return item.split('='); })
                  .compact()
                  .object()
                  .value();
    
    params["q"] = newPhrase;

    var newParams = _.chain(params)
                     .map(function(value,key) { return key + "=" + value })
                     .join("&")
                     .value();

    var currentPath = window.location.pathname;
    var newPath = currentPath + "?" + newParams;
    window.history.replaceState({}, "Crumbles", newPath);
  },

  getPhraseFromUrl: function() {
    var params = _.chain( location.search.slice(1).split('&') )
                  .map(function(item) { if (item) return item.split('='); })
                  .compact()
                  .object()
                  .value();
    var phrase = params["q"];
    if (phrase === undefined) {
      return "Hello and welcome!";
    } else {
      return decodeURIComponent(phrase);
    }
  },

  handleText: function(text) {
    this.updateUrl(text);
    var words = this.makeWords(text);
    this.props.onInput(words);
  },

  makeWords: function(text) {
    var noPunctuation = text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, " ");
    var spacedOut = noPunctuation.replace(/[^[a-zA-Z\s]/g, '');
    var lowercase = spacedOut.toLowerCase();
    var words = lowercase.split(" ");
    return _.compact(words);
  },

  render: function() {
    var wordsRemaining = 120;
    var phrase = this.getPhraseFromUrl();
    return (
      <div idName="phrase-input">
      <TextBox onWordInput={this.handleText} phrase={phrase} />
      <WordCount words={wordsRemaining} />
      </div>
    );
  }
});


var TextBox = React.createClass({
  getInitialState: function() {
    return { timeoutId: 0 }
  },

  sanitize: function(text) {
    var nolines = text.replace(/(\r\n|\n|\r)/gm,"");
    return nolines.replace(/[^[\w|\s|'|\?|.|\!|;|:|\-|–]/g,"");
  },

  handleInput: function(e){
    window.clearTimeout(this.state.timeoutId);

    if (e.which === 13) {
      // enter pressed, play immediately
      e.preventDefault();
      this.processInput();
    } else {
      // play when they stop typing
      newTimeoutId = window.setTimeout(this.processInput, 1500); 
      this.setState({ timeoutId: newTimeoutId });
    }
  },
  processInput: function(){
    var txt = this.getDOMNode().value;
    var sanitized = this.sanitize(txt);
    this.props.onWordInput(sanitized); 
  },

  render: function() {
    var txt = this.sanitize(this.props.phrase);
    return (
      <textarea onKeyUp={this.handleInput}>{txt}</textarea>
    );
  }
});

var WordCount = React.createClass({
  render: function() {
    return (
      <p>{this.props.words} words remaining. </p>
    );
  }
});

var Player = React.createClass({

  getInitialState: function() {

    return { 
      ready: false,
      videoPlaylist: [],
      audioPlaylist: [],
      videosPlayed: [],
      audioPlayed: [],
      loadedVideo: 0,
      loadedAudio: 0
    };
  },
  
  shouldComponentUpdate: function(nextProps, nextState) {
    var current = this.props.entries;
    var next = nextProps.entries;

    if (_.isEqual(current, next)) {
      console.log("entries are the same");
      return false;
    } else {
      console.log("entries are not the same");

      this.setState({
        ready: false,
        videoPlaylist: [],
        audioPlaylist: [],
        videosPlayed: [],
        audioPlayed: [],
        loadedVideo: 0,
        loadedAudio: 0
      });
      return true;
    }
  },

  preload: function() {
    console.log("Loading videos...");


    var entries = this.props.entries;

    for(var i=0; i < entries.length; i++) {
      console.log("    in video load loop, " + i + "/" + entries.length);
      var entry = entries[i];
      this.getVideo(entry, i);
    }
  },


  getVideo: function(entry, i) {
    // Capture context
    var player = this;

    // set up our request
    var url = entry["video_url"];
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    var vidTag = this.refs.video.getDOMNode();
    if(vidTag.canPlayType && vidTag.canPlayType('video/mp4').replace(/no/, '')) {
      xhr.open('GET', url + ".mp4", true);
    } else {
      xhr.open('GET', url + ".webm", true);
    }

    // Go
    xhr.onload = function(e) {
      if (this.status == 200) {
        var myBlob = this.response;
        var vid = (window.webkitURL ? webkitURL : URL).createObjectURL(myBlob);

        var videoPlaylist = player.state.videoPlaylist;
        videoPlaylist[i] = { video: vid, defined: entry["defined"] };

        var loadedVideo = player.state.loadedVideo + 1; 
        var targetLength = player.props.entries.length;

        console.log(loadedVideo + " / " + targetLength + " entries loaded" );

        if(loadedVideo === targetLength) { 
          player.setState({
            ready: true,
            videoPlaylist: videoPlaylist,
            audioPlaylist: player.state.audioPlaylist,
            videosPlayed: [],
            audioPlayed: [],
            loadedVideo: loadedVideo,
            loadedAudio: player.state.loadedAudio
          });
          player.playMashup();

        } else if (loadedVideo < targetLength) {
          player.setState({
            ready: false,
            videoPlaylist: videoPlaylist,
            audioPlaylist: player.state.audioPlaylist,
            videosPlayed: [],
            audioPlayed: [],
            loadedVideo: loadedVideo,
            loadedAudio: player.state.loadedAudio
          });
        } else { 
          console.log("loaded is toooooo big");
        }
       }
    }
    xhr.send();
  },

  getTTSAudio: function(entry) {
    var word = encodeURIComponent(entry["word"]);
    var url = "http://translate.google.com/translate_tts?ie=UTF-8&tl=en-us&q=" + word;
    
  },
  playMashup: function() {
    var player = this;
    var videoPlaylist = player.state.videoPlaylist;
    var videosPlayed = player.state.videosPlayed;

    if (videoPlaylist.length > 0) {

      // Get first video and move it to played
      current = videoPlaylist.shift();
      videosPlayed.push(entry);

      this.setState({
        ready: true,
        videoPlaylist: videoPlaylist,
        audioPlaylist: this.state.audioPlaylist,
        videosPlayed: videosPlayed,
        audioPlayed: this.state.audioPlayed,
        loadedVideo: this.state.loadedVideo,
        loadedAudio: this.state.loadedAudio
      });

      // Set new source
      vidTag = player.refs.video.getDOMNode();
      vidTag.src = current.video;
      vidTag.muted = !current.defined;

      // Bind to play next after this has ended
      var $video = $('#' + vidTag.id);
      $video.bind('ended', function () {
        $video.unbind('ended');
        player.playMashup();
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
      <div idName="player">
        <video ref='video' type='video/mp4' controls id='master-vid'></video>
        <audio ref="audio"></audio>
      </div>
    );
  }
});

React.render(<MashupContainer dictionary={StandardDict} />, document.getElementById("main"));