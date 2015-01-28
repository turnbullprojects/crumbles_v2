var MashupContainer = React.createClass({displayName: "MashupContainer",

  getInitialState: function() { 
    return { 
      phrase: [],
      dictionary: LouisDictionary,
      video: "http://upverse.com/materials/video/dictionaries/louis/phrases/Y2FuIHlvdSBzYXkgaXQgYmV0dGVy.mp4"
    } 
  },

  componentDidMount: function(){
    $("#initial-loader").hide();
  },
 
  switchDictionary: function(dictName){ 
    if (dictName === "louis") {
      this.setState({ 
        phrase: this.state.phrase,
        dictionary: LouisDictionary,
        video: this.state.video
      });
    }
    else if (dictName === "donna") {
      this.setState({ 
        phrase: this.state.phrase,
        dictionary: DonnaDictionary,
        video: this.state.video
      });   
    }
  
  },

  handlePhraseInput: function(words) {

    var oldPhrase = this.state.phrase;
    var newPhrase = [];

    for (var i=0; i < words.length; i++) {
      var word = words[i]
      var entry = this.findInDictionary(this.state.dictionary, word);
      if (!entry) {
        var undedfinedEntry = this.notInDictionary(this.state.dictionary, word);
        // clone or it will binds all undefined to final word used
        entry = _.clone(undedfinedEntry); 
      }

      newPhrase.push(entry);
    }
    this.setState({ phrase: newPhrase, video: this.state.video });
    var video = this.getVideo(words);
  },

  getVideo: function(words) {
    var text = words.join(" ");
    var that = this;
    var dict = this.state.dictionary["dictionary"].toLowerCase();
    var voice = this.state.dictionary["voice"].toLowerCase();
    $.get("http://upverse.com/app/dictionary/" + dict + "/" + text + "?voice=" + voice)
     .success(function(results) {
        console.log("COMPLETE");
        console.log(results);
       var video = "http://" + results["video"];
       that.setState({ phrase: that.state.phrase, video: video });
       console.log("video is " + video);
       console.log("state of video is " + that.state.video)
     });
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
    var randomVideo = dictionary["entries"]["jury"];
    randomVideo["defined"] = false;
    randomVideo["word"] = word;
    return randomVideo;
  },
  addWordFromList: function(entry){
    this.refs.input.refs.textbox.handleInput();
  },

  render: function() {
    var entries = [];
    var currentChar = this.state.dictionary["dictionary"];

    return (
      React.createElement("div", {id: "crumbles"}, 
       React.createElement("div", {id: "word-list", className: "dictionaryContainer"}, 
          React.createElement("div", {id: "dictionary"}, 
            React.createElement(WordList, {dictionary: this.state.dictionary, onButtonClick: this.addWordFromList})
          )
        ), 
 
        React.createElement("div", {id: "mashup-container"}, 
          React.createElement("header", null, 
            React.createElement("h1", {id: "suits"}, 
              "WATCH ", React.createElement("span", {className: "bold red"}, "SUITS"), " WEDNESDAYS AT 10/9c ON USA"
            )
          ), 
          React.createElement(CharacterList, {ref: "characters", switchChar: this.switchDictionary, currentChar: currentChar}), 
   
          React.createElement(PhraseInput, {ref: "input", entries: this.state.phrase, onInput: this.handlePhraseInput}), 
          React.createElement(Player, {video: this.state.video})
        )
     )
    );
  }
});
