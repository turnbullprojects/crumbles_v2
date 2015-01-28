var Player = React.createClass({displayName: "Player",

  getVideo: function(video_url) {
    var url;
    var el = this.refs.video.getDOMNode();

    if(this.el.canPlayType && this.vidNode().canPlayType('video/mp4').replace(/no/, '')) {
        url = entry["mp4"];
    } else {
        url = entry["webm"];
    }
    this.getMedia(url, entry, i, true);
  },

  render: function() {
    var source = this.setVideo(this.props.video);
    return (
      React.createElement("div", {idName: "player"}, 
        React.createElement("video", {ref: "video", src: source, type: "video/mp4", id: "master-vid"}), 
        React.createElement("div", {ref: "loader", className: "loader"}), 
        React.createElement("div", {ref: "button", className: "playButton", onClick: this.refs.video.play()}, 
          React.createElement("img", {src: "./assets/play.svg"})
        )
      )
    );
  }
});
