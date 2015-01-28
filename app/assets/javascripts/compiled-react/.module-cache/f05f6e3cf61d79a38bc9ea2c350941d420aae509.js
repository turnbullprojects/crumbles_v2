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
        React.createElement("audio", {ref: "audio", src: this.currentAudioSrc()})
      )
    );
  }
});
