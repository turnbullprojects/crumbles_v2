var Entry = function(){
  
  entry: null,
  query: null,
  pretty: null,
  defined: true,
  profane: false,
  overLimit: false,

  video: { 
    mp4: this.entry ? entry["mp4"] : null, 
    webm: this.entry ? entry["webm"] : null
  },

  image: { 
    full: this.entry ? entry["screenshot"] : null, 
    thumbnail: this.entry ? entry["screenshot"] : null
  },

  markup: function(){
    if(this.overLimit === true) {
      return "<span class='disabled'>" + this.pretty + "</span>";
    } else if(this.profane === true) {
      return "<span class='profane'>" + this.pretty + "</span>";
    } else if(this.defined === false) {
      return "<span class='undefined'>" + this.pretty + "</span>";
    } else {
      return this.pretty;
    }
  }

}
