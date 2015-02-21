var MashupContainer = React.createClass({

  getInitialState: function() { 
    return { 
      phrase: [],
      video: "https://crumbles-2015.s3.amazonaws.com/resources/video/dictionaries/standard/phrases/d2VsY29tZSB0byBjcnVtYmxlcw%3D%3D.mp4"
    } 
  },

  componentDidMount: function(){
    $("#initial-loader").hide();
  },
 
  switchDictionary: function(dictName){ 
    console.log("Switching to " + dictName);
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
      var entry = this.findInDictionary(this.props.dictionary, word);
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
    var dict = this.props.dictionary["dictionary"].toLowerCase();
    var voice = this.props.dictionary["voice"].toLowerCase();
    $.get("https://upverse.com/app/dictionary/" + dict + "/" + text + "?voice=" + voice)
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
    var randomVideo = dictionary["entries"]["1"];
    randomVideo["defined"] = false;
    randomVideo["word"] = word;
    return randomVideo;
  },
  addWordFromList: function(entry){
    this.refs.input.refs.textbox.handleInput();
  },

  render: function() {
    var entries = [];
    $("#initial-loader").hide();
    var currentChar = this.props.dictionary["dictionary"];

    return (

      <div id="crumbles">
       <header className="crumbles">
         <h1 id='crumbles-logo'>
           Crumbles
         </h1>
         <div id='thirtylabs-logo'>
            <p>created at</p>
           <a href="http://thirtylabs.com" target="_blank">
             <img src="/assets/30L.svg" />
           </a>
         </div>
         <div id='dictionary-select'>
           <div id='current-dictionary' className='dict-standard'>
             <img src='/assets/down-arrow.png' />
           </div>
           <ul>
             <li className='dict-standard'>Movie Clips</li>
             <li className='dict-homer'>Homer Simpson</li>
             <li className='dict-bp'>Bee & Puppycat</li>
           </ul>
         </div>
       </header>

       <div id="word-list" className="dictionaryContainer">
          <div id="dictionary">
            <WordList dictionary={this.props.dictionary} onButtonClick={this.addWordFromList}/>
          </div>
        </div>
 
        <div id="mashup-container">
             
          <PhraseInput ref="input" entries={this.state.phrase} onInput={this.handlePhraseInput} />
          <Player video={this.state.video} />
        </div>
     </div>
    );
  }
});
