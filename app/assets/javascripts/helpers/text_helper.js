var TextHelper = function() {
  maxWords: 25,

  process: function(text) {
    var pretty = this.prettySanitize(text);
    var prettyAry = this.wordArray(pretty);
    var prettyAndSearchable = _.map(prettyAry, function(prettyWord){
      var searchable = this.sanitizeForSearch(prettyWord);
      return { pretty: prettyWord, query: searchable }
    });
    return prettyAndSearchable;
  },

  sanitizeForSearch: function(text) {
    var s = new ChainableSanitizer(text);
    return s.noPunctuation().bleach().value().toLowerCase();
  },

  prettySanitize: function(text) {
    var s = new ChainableSanitizer(text);
    return s.noHTML().singleSpace().noNBSP().oneLine().onlyBasicChars().value();
  },

  wordArray: function(txt){
    return _.compact(txt.split(" "));
  },

  beforeLimit: function(ary) {
    return ary.slice(0,maxWords);
  },

  afterLimit: function(ary){
    return ary.slice(maxWords,ary.length);
  },

  wordsRemaining: function(sanitizedTxt) {
    var words = this.wordArray(sanitizedTxt);
    return this.maxWords - words.length;
  },

  disabledWords: function(ary){ 
    var disabled = this.afterLimit(ary);
    var last = disabled.length - 1;
    disabled[0] = "<span class='disabled'>" + disabled[0];
    disabled[last] = disabled[last] + "</span>";
    return disabled;
  },

  wordMarkup: function(entry) {
    if (entry.defined === false) {
      return "<span class='undefined'>" + entry.pretty + "</span>";
    }
    else {
      return entry.pretty;
    }
  }



}
