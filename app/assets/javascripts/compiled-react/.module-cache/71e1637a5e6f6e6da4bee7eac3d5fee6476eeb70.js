var Player = React.createClass({displayName: "Player",

  setVideo: function(video_url) {
    if (this.refs.video) {
      var el = this.refs.video.getDOMNode();

      if(this.el.canPlayType && this.vidNode().canPlayType('video/mp4').replace(/no/, '')) {
      } else {
        video_url = video_url.replace(/\.mp4/,".webm");
      }
      return video_url;
    }
  },

  playVideo: function() {
    if (this.refs.video) { this.refs.video.getDOMNode.play() }
  },

  render: function() {
    var source = this.setVideo(this.props.video);
    return (
      React.createElement("div", {idName: "player"}, 
        React.createElement("video", {ref: "video", src: source, type: "video/mp4", id: "master-vid"}), 
        React.createElement("div", {ref: "loader", className: "loader"}), 
        React.createElement("div", {ref: "button", className: "playButton", onClick: this.playVideo}, 
          React.createElement("img", {src: "./assets/play.svg"})
        )
      )
    );
  }
});
