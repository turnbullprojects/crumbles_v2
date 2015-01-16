var MashupContainer = React.createClass({

  getInitialState: function() { 
    return { 
      phrase: [],
      audioNeeded: 0
    } 
  },
 
  handlePhraseInput: function(words) {

    var newAudioNeeded = 0;
    var oldPhrase = this.state.phrase;
    var newPhrase = [];
    var samePhrase = true;

    for (var i=0; i < words.length; i++) {
      var word = words[i];
      if(oldPhrase[i] && word === oldPhrase[i]["word"]) {
        newPhrase.push(oldPhrase[i]);
      } 
      else {
        var entry = this.findInDictionary(StandardDict, word);
        if (!entry) {
          var undedfinedEntry = this.notInDictionary(StandardDict, word);
          // clone or it will binds all undefined to final word used
          entry = _.clone(undedfinedEntry); 
          newAudioNeeded += 1
        }


        newPhrase.push(entry);

        samePhrase = false;

      }
    };
    if(!samePhrase) {

      var audioNeeded;
      if (newAudioNeeded == 0) {
        audioNeeded = this.state.audioNeeded;
      } else {
        audioNeeded = newAudioNeeded;
      }
      this.setState({ phrase: newPhrase, audioNeeded: audioNeeded });
    }
  },

  findInDictionary: function(dictionary, word) {
    var entry = dictionary["entries"][word]
    if (entry != undefined) {
      entry["defined"] = true;
      return entry;
    } else {
      return false;
    }
  },

  notInDictionary: function(dictionary, word) {
    var randomVideo = dictionary["entries"]["duck"];
    randomVideo["defined"] = false;
    randomVideo["word"] = word;
    return randomVideo;
  },

  render: function() {
    var entries = [];

    return (
      <div idName="mashup-container">
        <PhraseInput onInput={this.handlePhraseInput} />
        <Player entries={this.state.phrase} audioNeeded={this.state.audioNeeded} />
      </div>
    );
  }
});

var PhraseInput = React.createClass({

  handleText: function(text) {
    var words = this.makeWords(text);
    console.log(words);
    this.props.onInput(words);
  },

  makeWords: function(text) {
    console.log(text);
    var noPunctuation = text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, " ");
    var spacedOut = noPunctuation.replace(/[^[a-zA-Z\s]/g, '');
    var lowercase = spacedOut.toLowerCase();
    var words = lowercase.split(" ");
    return _.compact(words);
  },

  render: function() {
    var wordsRemaining = 120;
    return (
      <div idName="phrase-input">
      <TextBox onWordInput={this.handleText} />
      <WordCount words={wordsRemaining} />
      </div>
    );
  }
});


var TextBox = React.createClass({
  getInitialState: function() {
    return { timeoutId: 0 }
  },

  componentDidMount: function() {

    var text = this.getPhraseFromUrl();
    var inputNode = this.refs.box.getDOMNode();
    inputNode.innerHTML = text;
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

  sanitize: function(text) {
    console.log(text);
    var nohtml = text.replace(/(<([^>]+)>)/ig," ");
    var nonbsp = nohtml.replace("&nbsp","");
    var nolines = nonbsp.replace(/(\r\n|\n|\r)/gm,"");
    var sanitized = nolines.replace(/[^[\w|\s|\u00A0|'|\?|.|\!|;|:|\-|–]/g,"");
    console.log('sanitized = ' + sanitized);
    return sanitized;
  },

  handleAfterTimeout: function(e){
    window.clearTimeout(this.state.timeoutId);
    newTimeoutId = window.setTimeout(this.processInput, 1500); 
    this.setState({ timeoutId: newTimeoutId });
  },

  processInput: function(){
    var txt = this.refs.box.getDOMNode().innerHTML;
    var sanitized = this.sanitize(txt);
    this.updateUrl(sanitized);
    this.props.onWordInput(sanitized); 
  },

  render: function() {
    return (
      <div id='mashup-input' ref="box" contentEditable='true' onKeyUp={this.handleAfterTimeout}></div>
    );
  }
});

var WordCount = React.createClass({
  render: function() {
    return (
      <div id="words-left">
        <b>{this.props.words}</b> | words remaining.
      </div>
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
    // This function stops render action 
    // if there has not been a change

    var current = this.props.entries;
    var next = nextProps.entries;

    if (_.isEqual(current, next)) {
      return false; // don't render
    } else {
      // update state to reflect 0 loaded
      this.setState({
        ready: false,
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
          
          // Audio Playlist is in the rightorder, 
          // but it holds nil for the empy values
          audioPlaylist = _.compact(audioPlaylist);

          // Set ready to true and play
          player.setState({
            ready: true,
            videoPlaylist: videoPlaylist,
            audioPlaylist: audioPlaylist,
            videosPlayed: [],
            audioPlayed: [],
            loadedVideo: loadedVideo,
            loadedAudio: loadedAudio
          });
          player.playMashup();

        } else if (loaded < target) {
          // Still more to load...
          player.setState({
            ready: false,
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
        ready: true,
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
      <div idName="player">
        <video ref='video' type='video/mp4' controls id='master-vid'></video>
        <audio ref="audio"></audio>
      </div>
    );
  }
});

React.render(<MashupContainer dictionary={StandardDict} />, document.getElementById("main"));
