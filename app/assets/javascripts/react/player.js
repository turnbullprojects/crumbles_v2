var Player = React.createClass({

  setVideo: function(video_url) {
    if (this.refs.video) {
      var el = this.refs.video.getDOMNode();

      if(el.canPlayType && el.canPlayType('video/mp4').replace(/no/, '')) {
      } else {
        video_url = video_url.replace(/\.mp4/,".webm");
      }
      return video_url;
    }
  },

  playVideo: function() {
    if (this.refs.video) { 
      this.refs.video.getDOMNode().play(); 
      $(".playButton").hide();
      $("#master-vid").bind("ended", function(){
        $(".playButton").show();
      });
    } 

  },

  render: function() {
    var source = this.setVideo(this.props.video);
    return (
      <div idName="player">
        <video ref='video' src={source} type='video/mp4' id='master-vid'></video>
        <div ref="loader" className="loader hide" ></div>
        <div ref="button" className="playButton hide" onClick={this.playVideo}>
          <img src="./assets/play.svg" />
        </div>
      </div>
    );
  }
});
