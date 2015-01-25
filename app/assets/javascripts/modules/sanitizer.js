var Sanitizer = function() {

  noHTML: function(text){
    return text.replace(/(<([^>]+)>)/ig," ");
  },
  singleSpace: function(text) {
    return text.replace(/\s{2,}/g, ' ');
  },
  noNBSP: function(text){
    return text.replace("&nbsp;","").replace("nbsp;","");
  },
  oneLine: function(text){
    return text.replace(/(\r\n|\n|\r)/gm,"");
  },
  onlyBasicChars: function(text) {
    return text.replace(/[^[\w|\s|\u00A0|'|\?|.|,|\!|;|:|\-|–]/g,"");
  },
  noPunctuation: function(text) {
    return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, " ");
  },
  bleach: function(text){
    return.replace(/[^[a-zA-Z0-9\s]/g, '');
  }
  makeArray: function(text){
    var splitTxt = text.split(" ");
    return _.compact(splitTxt);
  }


}

