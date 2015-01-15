var MashupContainer = React.createClass({
  render: function() {

    var videos = ["http://d12e12gqkzvzep.cloudfront.net/standard/cartoon","http://d12e12gqkzvzep.cloudfront.net/standard/and"];
    return (
      <div idName="mashup-container">
        <PhraseInput dictionary={this.props.dictionary} />
        <Player videos={videos} />
      </div>
    );
  }
});

var PhraseInput = React.createClass({

  render: function() {
    var wordsRemaining = 120;
    return (
      <div idName="phrase-input">
      <TextBox />
      <WordCount words={wordsRemaining} />
      </div>
    );
  }
});


var TextBox = React.createClass({
  handleInput: function(e){
    console.log("input");
  },

  render: function() {
    return (
      <textarea onKeyUp={this.handleInput}>crumbles is awesome</textarea>
    );
  }
});

var WordCount = React.createClass({
  render: function() {
    return (
      <p>{this.props.words} words remaining. </p>
    );
  }
});

var Player = React.createClass({

  getInitialState: function() {
    // use loaded variable instead of playlist.length
    // we async insert to the array at an index
    // so playlist.length may count nul values 
    // if the third word loads first you'll get [,,loadedVid]
    // which is length 3, and not an accurate loaded count
    return { ready: false, playlist: [], played: [], loaded: 0 };
  },

  componentDidMount: function() {
    this.preload();
  },

  preload: function() {

    var videos = this.props.videos;

    for(var i=0; i < videos.length; i++) {
      var video = videos[i];
      this.getVideo(video, i);
    }
  },


  getVideo: function(url, i) {
      var player = this;


      var xhr = new XMLHttpRequest();

      var vidTag = this.getDOMNode();

      if(vidTag.canPlayType && vidTag.canPlayType('video/mp4').replace(/no/, '')) {
        xhr.open('GET', url + ".mp4", true);
      } else {
        xhr.open('GET', url + ".webm", true);
      }
  
      xhr.responseType = 'blob';
      xhr.onload = function(e) {
        if (this.status == 200) {

          var myBlob = this.response;
          var vid = (window.webkitURL ? webkitURL : URL).createObjectURL(myBlob);

          var playlist = player.state.playlist;
          var loaded = player.state.loaded + 1; 

          playlist[i] = vid;


          var targetLength = player.props.videos.length;


          if(loaded === targetLength) { 
            player.setState({ready: true, playlist: playlist, played: [], loaded: loaded });
            console.log("Video " + i + " loaded. " + "Total " + loaded);

            console.log("all loaded!");



            player.playMashup();

          } else {
            console.log("Video " + i + " loaded. " + "Total " + loaded);
            player.setState({ready: false, playlist: playlist, played: [], loaded: loaded });
          }
         }
      }
      xhr.send();
  },


  endedTest: function() {
    console.log("ended!");
  },

  playMashup: function() {
    var player = this;
    var playlist = player.state.playlist;
    var played = player.state.played;

    console.log("Playlist: " + playlist.length);

    console.log("Played: " + played.length);

    if (playlist.length > 0) {
      console.log("playing");

      video = playlist.shift();
      played.push(video);

      this.setState({
        ready: true, 
        playlist: playlist, 
        played: played, 
        loaded: this.state.loaded 
      });

      vidTag = player.getDOMNode();
      vidTag.src = video;


      var $video = $('#' + vidTag.id);
      $video.bind('ended', function () {
        $video.unbind('ended');
        player.playMashup();
      });

      vidTag.play();

    } else {
      console.log("Nothing left in playlist");
    }
  },

  render: function() {
    return (
      <video type='video/mp4' controls id='master-vid'></video>
    );
  }
});

React.render(<MashupContainer dictionary={StandardDict} />, document.getElementById("main"));