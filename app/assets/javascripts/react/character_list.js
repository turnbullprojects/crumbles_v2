var CharacterList = React.createClass({



  handleClick: function(e) {
    console.log( "click");
    var sender = (e && e.target) || (window.event && window.event.srcElement);
    var charId = sender.id;
    if(charId) {
      this.props.switchChar(charId);
      $("#initial-loader").show();
      $(".active").removeClass("active");
      $("#" + charId).addClass("active");
    }
  },
 
  render: function() {

    
    return (
      <div id="character-list">
        <div ref="louis" id="louis" className="character louis" onClick={this.handleClick}></div>
        <div ref="donna" id="donna" className="character donna active" onClick={this.handleClick}></div>
        <div ref="harvey" className="character harvey coming-soon" onClick={this.handleClick}></div>
        <div ref="mike" className="character mike coming-soon" onClick={this.handleClick}></div>
        <div ref="all" className="character all coming-soon" onClick={this.handleClick}></div>
        <div className="clear"></div>
      </div>
    )
  }
});
