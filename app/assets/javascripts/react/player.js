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
      return entry;
    } else {
      console.log("not in dictionary");
      return this.notInDictionary(dictionary);
    }
  },

  notInDictionary: function(dictionary) {
    return dictionary["entries"]["woohoo"];
  },

  render: function() {
    var videos = [];

    return (
      <div idName="mashup-container">
        <PhraseInput onInput={this.handlePhraseInput} />
        <Player videos={this.state.phrase} />
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
    return text.replace(/[^[\w|\s|'|\?|.|\!|;|:|\-|–]/g,"");
  },

  handleInput: function(e){

    window.clearTimeout(this.state.timeoutId);

    newTimeoutId = window.setTimeout(this.processInput, 1500); 

    this.setState({ timeoutId: newTimeoutId });
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
    // use loaded variable instead of playlist.length
    // we async insert to the array at an index
    // so playlist.length may count nul values 
    // if the third word loads first you'll get [,,loadedVid]
    // which is length 3, and not an accurate loaded count
    return { 
      ready: false, 
      playlist: [], 
      played: [], 
      loaded: 0 
    };
  },
  
  shouldComponentUpdate: function(nextProps, nextState) {
    var current = this.props.videos;
    var next = nextProps.videos;

    if (_.isEqual(current, next)) {
      console.log("videos are the same");
      return false;
    } else {
      console.log("videos are not the same");
      
      this.setState({
        ready: false,
        playlist: [],
        played: [],
        loaded: 0
      });
      return true;
    }
  },

  preload: function() {
    console.log("Loading videos...");



    var videos = this.props.videos;

    for(var i=0; i < videos.length; i++) {
      console.log("    in video load loop, " + i + "/" + videos.length);
      var video = videos[i];
      this.getVideo(video["video_url"], i);
    }
  },


  getVideo: function(url, i) {
    // Capture context
    var player = this;

    // set up our request
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    var vidTag = this.getDOMNode();
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

        var playlist = player.state.playlist;
        playlist[i] = vid;

        var loaded = player.state.loaded + 1; 
        var targetLength = player.props.videos.length;

        console.log(loaded + " / " + targetLength + " videos loaded" );

        if(loaded === targetLength) { 
          player.setState({ready: true, playlist: playlist, played: [], loaded: loaded });
          player.playMashup();

        } else if (loaded < targetLength) {
          player.setState({ready: false, playlist: playlist, played: [], loaded: loaded });
        } else { 
          console.log("loaded is huge");
        }
       }
    }
    xhr.send();
  },

  playMashup: function() {
    var player = this;
    var playlist = player.state.playlist;
    var played = player.state.played;

    if (playlist.length > 0) {

      // Get first video and move it to played
      video = playlist.shift();
      played.push(video);

      this.setState({
        ready: true, 
        playlist: playlist, 
        played: played, 
        loaded: this.state.loaded 
      });

      // Set new source
      vidTag = player.getDOMNode();
      vidTag.src = video;

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
      <video type='video/mp4' controls id='master-vid'></video>
    );
  }
});

React.render(<MashupContainer dictionary={StandardDict} />, document.getElementById("main"));