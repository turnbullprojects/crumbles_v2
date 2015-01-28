var Player = React.createClass({displayName: "Player",

  //////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////
  render: function() {
    return (
      React.createElement("div", {idName: "player"}, 
        React.createElement("video", {ref: "video", src: this.props.video, poster: poster, type: "video/mp4", id: "master-vid"}), 
        React.createElement("div", {ref: "loader", className: "loader"}), 
        React.createElement("div", {ref: "button", className: "playButton", onClick: this.refs.video.play()}, 
          React.createElement("img", {src: "./assets/play.svg"})
        )
      )
    );
  }
});
