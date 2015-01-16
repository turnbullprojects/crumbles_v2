
var WordCount = React.createClass({
  render: function() {
    return (
      <div id="words-left">
        <b>{this.props.wordLeft}</b> | words remaining.
      </div>
    );
  }
});