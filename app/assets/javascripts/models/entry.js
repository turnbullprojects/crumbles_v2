var Entry = function(entry){
  
  this.word = entry["word"];
  this.video = { mp4: entry["mp4"], webm: entry["webm"] };
  this.image = { full: entry["screenshot"], thumbnail: entry["screenshot"] }

}
