var WordList = React.createClass({

  render: function() {
    var entries = this.props.dictionary["entries"];
    var keys = Object.keys(entries);
    var listings = [];

    for(var i=0; i < keys.length; i++) {
      var entry = entries[keys[i]];
      listings.push(<WordListing entry={entry} onButtonClick={this.props.onButtonClick}/>);
    }

    return (
      <div idName="words" >
        {listings}
      </div>
    );
  }

});
