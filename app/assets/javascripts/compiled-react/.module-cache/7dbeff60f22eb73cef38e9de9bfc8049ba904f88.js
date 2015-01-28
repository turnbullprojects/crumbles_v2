var Player = React.createClass({displayName: "Player",
 
  //////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////
  render: function() {
    var loader = "loader";
    var button = "playButton hide"

    return (
      React.createElement("div", {idName: "player"}, 
        React.createElement("video", {ref: "video", src: this.currentVideoSrc(), poster: poster, type: "video/mp4", id: "master-vid"}), 
        React.createElement("audio", {ref: "audio", src: this.currentAudioSrc()}), 
        React.createElement("div", {ref: "loader", className: loader}), 
        React.createElement("div", {ref: "button", className: button, onClick: this.replay}, 
          React.createElement("img", {src: "./assets/play.svg"})
        )
      )
    );
  }
});
