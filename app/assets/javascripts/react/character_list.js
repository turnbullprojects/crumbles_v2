var CharacterList = React.createClass({


  getCurrentChar: function() {
    if (this.props.currentChar === "louis") {
      <div ref="louis" class="character louis active"></div>
      <div ref="donna" class="character donna" onClick={this.props.switchChar("donna")}></div>
    } 
    else if (this.props.currentChar === "donna"){
      <div ref="louis" class="character louis" onClick={this.props.switchChar("louis")}></div>
      <div ref="donna" class="character donna active" ></div>
    }
  },
 
  render: function() {

    var activeChars = this.getCurrentChar();
    
    return (
      <div id="character-list">
        {activeChars}
        <div ref="harvey" class="character harvey coming-soon"></div>
        <div ref="harvey" class="character mike coming-soon"></div>
        <div ref="all" class="character all coming-soon"></div>
      </div>
    )
  }
 
