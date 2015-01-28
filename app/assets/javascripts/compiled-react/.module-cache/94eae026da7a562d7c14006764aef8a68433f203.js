var CharacterList = React.createClass({displayName: "CharacterList",


  getCurrentChar: function() {
    if (this.props.currentChar === "louis") {
      React.createElement("div", {className: "active-chars"}, 
        React.createElement("div", {ref: "louis", class: "character louis active"}), 
        React.createElement("div", {ref: "donna", class: "character donna", onClick: this.props.switchChar("donna")})
      )
    } 
    else if (this.props.currentChar === "donna"){
      React.createElement("div", {className: "active-chars"}, 
        React.createElement("div", {ref: "louis", class: "character louis", onClick: this.props.switchChar("louis")}), 
        React.createElement("div", {ref: "donna", class: "character donna active"})
      )
    }
  },
 
  render: function() {

    var activeChars = this.getCurrentChar();
    
    return (
      React.createElement("div", {id: "character-list"}, 
        activeChars, 
        React.createElement("div", {ref: "harvey", class: "character harvey coming-soon"}), 
        React.createElement("div", {ref: "harvey", class: "character mike coming-soon"}), 
        React.createElement("div", {ref: "all", class: "character all coming-soon"})
      )
    )
  }
});
