var WordListing = React.createClass({
  
  
  showThumb: function() {
    var el = this.refs.img.getDOMNode();
    var thumb = this.props.entry["screenshot"];
    el.src = thumb

    console.log(el);
  },

  render: function() {
    var word = this.props.entry["word"];
    var thumbId = "thumbnail-" + word;
    console.log("rendering listing ");
    return (
      <div className="dictionary-button">
        <button className="insert-word" onMouseOver={this.showThumb} >
          {word}
        </button>
        <div id={thumbId} ref="thumb" className="preview-image">
          <img ref="img"></img>
        </div>
      </div>
    );
  }
});
