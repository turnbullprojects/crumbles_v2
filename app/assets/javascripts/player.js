// Play

var Word = function(entry) {
  var thisWord = this;
  this.txt = entry["word"];
  this.vUrl = entry["video_url"];
  this.thumbnail = entry["thumbnail"];
  this.vID = "vid-" + thisWord.txt;
  this.el = function() { return document.getElementById(thisWord.vID); }
  this.jqObj = function() { return $("#" + thisWord.vID); }
  this.blob = ""

  this.videoMarkup = function() {
    var vidMarkup = "<video id='" + thisWord.vID + "' class='hide' ></video>";
    return vidMarkup;
  }

}

var Phrase = function(str) {
  var thisPhrase = this;
  this.words = [];

  this.build = function(str, dictionary) {
    var pieces = str.split(" ");
    for(var i=0; i < pieces.length; i++) {
      var piece = pieces[i];
      var entry = dictionary[piece];
      if (entry !== undefined) {
        var word = new Word(entry);  
        this.words[i] = word;
      }       
    }
  }

}

var Playlist = function() {
  var thisPlaylist = this;
  this.list = [];

  this.add = function(word, index) {
    thisPlaylist.list[index] = word;
  }

  this.play = function() {
    if (thisPlaylist.list.length > 0) {
      word = thisPlaylist.list.shift()
      $vid = document.getElementById("master-vid");
      $vid.src = word.blob;
      $vid.poster = word.thumbnail;
      $vid.play();
    }
  }

}




var Mashup = function(dictionary) {
  var thisM = this;
  this.playlist = new Playlist(); 
  this.phrase = new Phrase();
  this.loadedCount = 0;
  this.dict = dictionary;
  this.container = $("#crumble-container");

  this.build = function(input) {
    $("#crumble-container").append("<video type='video/mp4' controls id='master-vid'></video");
    thisM.phrase.build(input, thisM.dict);
    var phrase = thisM.phrase
    for(var i=0; i < phrase.words.length; i++) {
      var word = phrase.words[i];
      thisM.playlist.add(word,i);
      thisM.preload(word);
    }
    vid = document.getElementById("master-vid");
    vid.addEventListener("ended",function() { thisM.playlist.play(); }, false);

  }


  this.preload = function(word) {
      var xhr = new XMLHttpRequest();
      v = document.getElementById("master-vid");
      if(v.canPlayType && v.canPlayType('video/mp4').replace(/no/, '')) {
        xhr.open('GET', word.vUrl + ".mp4", true);
      } else {
        xhr.open('GET', word.vUrl + ".webm", true);
      }

  
      xhr.responseType = 'blob';
      xhr.onload = function(e) {
        if (this.status == 200) {
          var myBlob = this.response;
          var vid = (window.webkitURL ? webkitURL : URL).createObjectURL(myBlob);
          // myBlob is now the blob that the object URL pointed to.
          word.blob = vid;
          
          thisM.checkIfReady();
         }
      }
      xhr.send();
  }

  this.checkIfReady = function() {
      thisM.loadedCount += 1;
      $("#progress").html(thisM.loadedCount + "/" + thisM.phrase.words.length + " loaded.");
      if(thisM.loadedCount === thisM.phrase.words.length) { 
        $("#play-button").show();
      } 
  }

  this.replay = function() {
    for(var i=0; i < thisM.phrase.words.length; i++) {
      thisM.playlist.add(word,i);
    }
    thisM.playlist.play();
  }

}



