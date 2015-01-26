var WordListing = React.createClass({
  
  handleClick: function() {
    // HACKY AND NOT AT ALL REACT-Y
    // FIX IN REFACTOR BRANCH
    var entry = this.props.entry
    var input = $("#mashup-input");
    var oldText = input.html(); 
    var newText = oldText + " " + entry["word"];
    input.html(newText);
    // and pretend we put it in
    var keyUp = $.Event("keyup");
    input.trigger(keyUp);
  },
  
  showThumb: function() {
    var el = this.refs.img.getDOMNode();
    var thumb = this.props.entry["screenshot"];
    el.src = thumb
  },

  render: function() {
    var word = this.props.entry["word"];
    var thumbId = "thumbnail-" + word;
    return (
      <div className="dictionary-button">
        <button className="insert-word" onMouseOver={this.showThumb} onClick={this.handleClick}>
          {word}
        </button>
        <div id={thumbId} ref="thumb" className="preview-image">
          <img ref="img"></img>
        </div>
      </div>
    );
  }
});
