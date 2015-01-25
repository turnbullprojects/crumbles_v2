var WordListing = React.createClass({
  render: function() {
    var word = this.props.entry["word"];

    console.log("rendering listing ");
    return (
      <li class="word-listing">
        {word}
      </li>
    );
  }
});
