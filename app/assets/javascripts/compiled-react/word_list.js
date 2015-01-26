var WordList = React.createClass({displayName: "WordList",

  render: function() {
    var entries = this.props.dictionary["entries"];
    var keys = Object.keys(entries);
    var listings = [];

    for(var i=0; i < keys.length; i++) {
      var entry = entries[keys[i]];
      listings.push(React.createElement(WordListing, {entry: entry, onButtonClick: this.props.onButtonClick}));
    }

    return (
      React.createElement("div", {idName: "words"}, 
        listings
      )
    );
  }

});
