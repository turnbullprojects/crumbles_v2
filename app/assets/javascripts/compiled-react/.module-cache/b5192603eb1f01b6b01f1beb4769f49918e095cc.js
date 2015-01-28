var CharacterList = React.createClass({displayName: "CharacterList",



  handleClick: function(e) {
    console.log( "click");
    var sender = (e && e.target) || (window.event && window.event.srcElement);
    var charId = sender.id;
    if(charId) {
      this.props.switchChar(charId);
      $(".active").removeClass("active");
      $("#" + charId).addClass("active");
    }
  },
 
  render: function() {

    
    return (
      React.createElement("div", {id: "character-list"}, 
        React.createElement("div", {ref: "louis", id: "louis", className: "character louis", onClick: this.handleClick}), 
        React.createElement("div", {ref: "donna", id: "donna", className: "character donna active", onClick: this.handleClick}), 
        React.createElement("div", {ref: "harvey", className: "character harvey coming-soon", onClick: this.handleClick}), 
        React.createElement("div", {ref: "mike", className: "character mike coming-soon", onClick: this.handleClick}), 
        React.createElement("div", {ref: "all", className: "character all coming-soon", onClick: this.handleClick}), 
        React.createElement("div", {className: "clear"})
      )
    )
  }
});
