var MashupContainer = React.createClass({

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

  render: function() {
    var entries = [];

    return (
      <div id="crumbles">
        <div id="word-list" className="dictionaryContainer">
          <div id="dictionary">
            <WordList dictionary={this.props.dictionary} />
          </div>
        </div>
 
        <div id="mashup-container">
          <PhraseInput entries={this.state.phrase} onInput={this.handlePhraseInput} />
          <Player entries={this.state.phrase} audioNeeded={this.state.audioNeeded} />
        </div>
     </div>
    );
  }
});
