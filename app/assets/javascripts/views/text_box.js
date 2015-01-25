var TextBox = React.createClass({

  handleInput: function(){
    var txt = this.refs.box.getDOMNode().innerHTML;
    this.props.onInput(txt);
  },


  processEntries: function() {
    if(this.refs.box === undefined) {
      // DOM not built yet
    } 
    else {
      var el = this.refs.box.getDOMNode();
      var entries = this.props.entries;
      var markup = _.map(entries, function(entry){ entry.markup(); });
      var html = markup.join(" ");
      this.saveCursorPositionAndUpdateHTML(el, html);
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

  render: function() {
    processEntries();
    return (
      <div idName="phrase-input">
      <div id='mashup-input' ref="box" contentEditable='true' onKeyUp={this.handleInput}></div>
      <WordCount wordLeft={this.props.wordsRemaining} />
      </div>
    );
  }
});
