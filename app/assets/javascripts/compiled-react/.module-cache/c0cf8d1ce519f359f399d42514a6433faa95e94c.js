var MashupContainer = React.createClass({displayName: "MashupContainer",

  getInitialState: function() { 
    return { 
      phrase: [],
      audioNeeded: 0,
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
        var entry = this.findInDictionary(this.props.dictionary, word);
        if (!entry) {
          var undedfinedEntry = this.notInDictionary(this.props.dictionary, word);
          // clone or it will binds all undefined to final word used
          entry = _.clone(undedfinedEntry); 
          newAudioNeeded += 1
        }

        newPhrase.push(entry);
        samePhrase = false;
      }
    };
    if(!samePhrase) {
      this.setState({ phrase: newPhrase, audioNeeded: newAudioNeeded });
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
          React.createElement(Player, {entries: this.state.video, audioNeeded: this.state.audioNeeded})
        )
     )
    );
  }
});
