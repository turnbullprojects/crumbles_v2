var MashupContainer = React.createClass({displayName: "MashupContainer",

  getInitialState: function() { 
    return { 
      phrase: [],
      video: "http://upverse.com/materials/video/dictionaries/louis/phrases/Y2FuIHlvdSBzYXkgaXQgYmV0dGVy.mp4"
    } 
  },
 

  handlePhraseInput: function(words, text) {

    var oldPhrase = this.state.phrase;
    var newPhrase = [];

    for (var i=0; i < words.length; i++) {
      var word = words[i]
      var entry = this.findInDictionary(this.props.dictionary, word);
      if (!entry) {
        var undedfinedEntry = this.notInDictionary(this.props.dictionary, word);
        // clone or it will binds all undefined to final word used
        entry = _.clone(undedfinedEntry); 
      }

      newPhrase.push(entry);
    }
    this.setState({ phrase: newPhrase, video: this.state.video });
    var video = this.getVideo(text);
  },

  getVideo: function(text) {
    var that = this;
    var dict = this.props.dictionary["dictionary"].to_lowercase;
    var voice = this.props.dictionary["voice"].to_lowercase;
    $.get("http://upverse.com/app/dictionary/" + dictionary + "/" + text + "?voice=?" + voice)
     .complete(function(data) {
       var video = data["video"]
       this.setState({ phrase: that.state.phrase, video: video });
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

    return (
      React.createElement("div", {id: "crumbles"}, 
       React.createElement("div", {id: "word-list", className: "dictionaryContainer"}, 
          React.createElement("div", {id: "dictionary"}, 
            React.createElement(WordList, {dictionary: this.props.dictionary, onButtonClick: this.addWordFromList})
          )
        ), 
 
        React.createElement("div", {id: "mashup-container"}, 
          React.createElement("header", null, 
            React.createElement("h1", {id: "suits"}, 
              "WATCH ", React.createElement("span", {className: "bold red"}, "SUITS"), " WEDNESDAYS AT 10/9c ON USA"
            )
          ), 
   
          React.createElement(PhraseInput, {ref: "input", entries: this.state.phrase, onInput: this.handlePhraseInput}), 
          React.createElement(Player, {entries: this.state.video})
        )
     )
    );
  }
});
