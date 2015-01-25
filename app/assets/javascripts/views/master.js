var Master = React.createClass({
  textHelper: new TextHelper(),

  getInitialState: function() { 
    return { 
      phrase: [],
      updatePhraseTID: 0
    } 
  },
 
  handleText: function(text) {
    // DICTIONARY LIST
    // filter dictionary for last thing typed

    // CREATE ENTRIESk

    // DISPLAY UNDEFINED
    // sanitize it

    // SEND TO PLAYER
    //
    window.clearTimeout(this.state.updatePhraseTID);
    timeoutId = window.setTimeout(this.updatePhrase(text), 1000); 
    this.setState({ 
      phrase: this.state.phrase,
      updatePhraseTID: timoutId
    });
  },

  updatePhrase: function(text) {
    var helper = this.textHelper;
    var words = helper.process();
    var searchTerms = helper.beforeLimit(words);
    var overLimit = helper.afterLimit(words);
    var phrase = [];

    _.each(searchTerms, function(searchPair){
      phrase.push(this.entryFor(searchPair));
    });

    _.each(overLimit, function(searchPair)){
      var e = Entry.new(query: searchPair.query, pretty: searchPair.pretty, overLimit: true);
      phrase.push(e);
    });

    this.setState({
      phrase: phrase,
      updatePhraseTID: this.state.updatePhraseTID
    });
  },

  entryFor: function(searchPair){
    var e = Entry.new(query: searchPair.query, pretty: searchPair.pretty);
    var result = this.props.dictionary[searchPair.query];
    if (result) {
      e.entry = result;   
    } else {
      e.entry = this.substituteEntry();
      e.defined = false;
    }
  },

  substituteEntry: function() {
    return this.props.dictionary["investigation"];
  },

  undefinedCount: function() {
    var count = 0;
    _.each(this.state.phrase, function(entry) {
      if(entry.undefined) { count += 1; }
    });
    return count;
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

  render: function() {
    var entries = [];
    var wordsRemaining = this.wordsRemaining();
    var audioNeeded = this.undefinedCount();

    return (
      <div id="crumbles">
        <div id="mashup-container">
          <div id="input-container">
            <TextBox onInput={this.handleText} entries={this.state.phrase} wordsRemaining={wordsRemaining}  />
          </div>

          <PhraseInput entries={this.state.phrase} onInput={this.handlePhraseInput} />
          <Player entries={this.state.phrase} audioNeeded={this.state.audioNeeded} />
        </div>
        <div id="word-list">
          <WordList dictionary={this.props.dictionary} />
        </div>
      </div>
    );
  }
});
