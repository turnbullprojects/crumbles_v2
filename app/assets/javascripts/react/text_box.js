var TextBox = React.createClass({
  getInitialState: function() {
    return { timeoutIdOne: 0, timeoutIdTwo: 0, wordsLeft: 0 }
  },

  componentDidMount: function() {

    var text = this.getPhraseFromUrl();
    var inputNode = this.refs.box.getDOMNode();
    inputNode.innerHTML = text;
    this.handleInput();
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
    var nohtml = text.replace(/(<([^>]+)>)/ig," ");
    var singlespace = nohtml.replace(/\s{2,}/g, ' ');
    var nonbsp = singlespace.replace("&nbsp;","").replace("nbsp;","");
    var nolines = nonbsp.replace(/(\r\n|\n|\r)/gm,"");
    var sanitized = nolines.replace(/[^[\w|\s|\u00A0|'|\?|.|,|\!|;|:|\-|–]/g,"");
    return sanitized;
  },

  handleInput: function(){

    var wordsLeft = this.state.wordsLeft

    wordsLeft = this.wordCount();
    window.clearTimeout(this.state.timeoutIdOne);
    window.clearTimeout(this.state.timeoutIdTwo);

    timeoutIdOne = window.setTimeout(this.processInput, 1000); 
    timeoutIdTwo = window.setTimeout(this.markUndefined, 1000); 

    this.setState({ timeoutIdOne: timeoutIdOne, 
                    timeoutIdTwo: timeoutIdTwo,
                    wordsLeft: wordsLeft 
                  });
  },

  wordCount: function() {
    var maxWords = 25;
    var txt = this.refs.box.getDOMNode().innerHTML;
    var sanitized = this.sanitize(txt);
    var words = _.compact(sanitized.split(" "));
    return maxWords - words.length;
  },

  markUndefined: function() {
    if(this.refs.box === undefined) {
      // DOM not built yet
    } 
    else {
      var entries = this.props.entries;
      var el = this.refs.box.getDOMNode();
      var innerText = this.refs.box.getDOMNode().innerHTML;
      var words = this.sanitize(innerText).split(" ");
      for(var i=0; i < words.length; i++) {
        var word = words[i];
        // Check if over word count
        if (i > 25) {
          words[i] = "<span class='disabled'>" + word + "</span>";
          continue;
        }
        // Check if defined
        for(var j=0;j < entries.length; j++) {

          var entry = entries[j];
          if(entry["defined"] === false) {
            var w = entry["word"];
            var regex = RegExp(w,"ig");
            if(word.match(regex)) {
              words[i] = "<span class='undefined'>" + word + "</span>"
            }
          }

        }
      }
      var newTxt = words.join(" ");
      this.saveCursorPositionAndUpdateHTML(el, newTxt);

      } 
     
  },



  saveCursorPositionAndUpdateHTML: function(el, newHTML) {
      try {
        // Setup range
        var sel = rangy.getSelection(el);
          var range = sel.getRangeAt(0);

        // Get cursor position
        var rangePrecedingBoundary = range.cloneRange();
        rangePrecedingBoundary.setStart(el, 0);
        var selEndOffset = rangePrecedingBoundary.text().length;
        rangePrecedingBoundary.setEnd(range.startContainer, range.startOffset);
        var selStartOffset = rangePrecedingBoundary.text().length;
        rangePrecedingBoundary.detach();

        // set html
        el.innerHTML = newHTML

        // Put cursor back
        range.selectCharacters(el, selStartOffset, selEndOffset);
        sel.setSingleRange(range);
      }
      catch (e)  {
        // Throws a DOMExceptionError on first load
        // because there's no cursor active
        // Not a problem
      }

  },

  processInput: function(){

    var txt = this.refs.box.getDOMNode().innerHTML;
    var sanitized = this.sanitize(txt);
    this.updateUrl(sanitized);
    this.props.onWordInput(sanitized); 
  },

  render: function() {

    return (
      <div idName="phrase-input">
      <div id='mashup-input' ref="box" contentEditable='true' onKeyUp={this.handleInput}></div>
      <WordCount wordLeft={this.state.wordsLeft} />
      </div>
    );
  }
});
