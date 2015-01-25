var ChainableSanitizer = function(text) {
  txt: text,
  s = new Sanitizer(),

  value: function() { 
    return this.txt; 
  },
  noHTML: function() { 
    this.txt = s.noHTML(this.txt);
    return this;
  },
  singleSpace: function() {
    this.txt = s.singleSpace(this.txt);
    return this;
  },
  noNBSP: function() {
    this.txt = s.noNBSP(this.txt);
    return this;
  },
  oneLine: function() {
    this.txt = s.oneLine(this.txt);
    return this;
  },
  onlyBasicChars: function() {
    this.txt = s.onlyBasicChars(this.txt);
    return this;
  },
  noPunctuation: function() {
    this.txt = s.noPunctuation(this.txt);
    return this;
  },
  bleach: function() {
    this.txt = s.bleach(this.txt);
    return this;
  }
  
}
