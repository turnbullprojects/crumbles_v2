var CharacterList = React.createClass({displayName: "CharacterList",


  getCurrentChar: function() {
    console.log(this.props.currentChar);
    if (this.props.currentChar === "Louis") {
      return (
        React.createElement("div", {className: "active-chars"}, 
          React.createElement("div", {ref: "louis", id: "louis", className: "character louis active"}), 
          React.createElement("div", {ref: "donna", id: "donna", className: "character donna", onclick: this.handleClick})
        )
      )
    } 
    else if (this.props.currentChar === "Donna"){
      return ( 
        React.createElement("div", {className: "active-chars"}, 
          React.createElement("div", {ref: "louis", id: "louis", className: "character louis", onClick: this.handleClick}), 
          React.createElement("div", {ref: "donna", id: "donna", className: "character donna active"})
        )
      )
    }
  },

  handleClick: function(e) {
    console.log( "click");
    console.log(e.target.id);
    var charId = e.target.id;
    this.props.switchChar(charId);
  },
 
  render: function() {

    var activeChars = this.getCurrentChar();
    
    return (
      React.createElement("div", {id: "character-list"}, 
        React.createElement("div", {ref: "louis", id: "louis", className: "character louis", onClick: this.handleClick}), 
        React.createElement("div", {ref: "donna", id: "donna", className: "character donna active", onClick: this.handleClick}), 
        React.createElement("div", {ref: "harvey", className: "character harvey coming-soon", onClick: this.handleClick}), 
        React.createElement("div", {ref: "mike", className: "character mike coming-soon", onClick: this.handleClick}), 
        React.createElement("div", {ref: "all", className: "character all coming-soon", onClick: this.handleClick})
      )
    )
  }
});
