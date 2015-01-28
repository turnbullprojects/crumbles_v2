var CharacterList = React.createClass({displayName: "CharacterList",


  getCurrentChar: function() {
    console.log(this.props.currentChar);
    if (this.props.currentChar === "Louis") {
      React.createElement("div", {className: "active-chars"}, 
        React.createElement("div", {ref: "louis", className: "character louis active"}), 
        React.createElement("div", {ref: "donna", className: "character donna", onClick: this.props.switchChar("donna")})
      )
    } 
    else if (this.props.currentChar === "Donna"){
      React.createElement("div", {className: "active-chars"}, 
        React.createElement("div", {ref: "louis", className: "character louis", onClick: this.props.switchChar("louis")}), 
        React.createElement("div", {ref: "donna", className: "character donna active"})
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
