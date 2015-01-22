
var WordCount = React.createClass({displayName: "WordCount",
  render: function() {
    return (
      React.createElement("div", {id: "words-left"}, 
        React.createElement("b", null, this.props.wordLeft), " | words remaining."
      )
    );
  }
});