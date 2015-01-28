var CharacterList = React.createClass({displayName: "CharacterList",


  getCurrentChar: function() {
    console.log(this.props.currentChar);
    if (this.props.currentChar === "Louis") {
      return (
        React.createElement("div", {className: "active-chars"}
        )
      )
    } 
    else if (this.props.currentChar === "Donna"){
      return ( 
        React.createElement("div", {className: "active-chars"}
        )
      )
    }
  },
 
  render: function() {

    var activeChars = this.getCurrentChar();
    
    return (
      React.createElement("div", {id: "character-list"}, 
        activeChars, 
        React.createElement("div", {ref: "harvey", className: "character harvey coming-soon"}), 
        React.createElement("div", {ref: "harvey", className: "character mike coming-soon"}), 
        React.createElement("div", {ref: "all", className: "character all coming-soon"})
      )
    )
  }
});
