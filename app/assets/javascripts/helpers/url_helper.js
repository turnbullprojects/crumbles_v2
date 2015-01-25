var UrlHelper = function() {

  updateUrl: function(words) {
    var newPhrase = encodeURIComponent(words);

    var params = _.chain( window.location.search.slice(1).split('&') )
    .map(function(item) { if (item) return item.split('='); })
      .compact()
    .object()
    .value();

    params["q"] = newPhrase;

    var newParams = _.chain(params)
    .map(function(value,key) { return key + "=" + value })
    .join("&")
    .value();

    var currentPath = window.location.pathname;
    var newPath = currentPath + "?" + newParams;
    window.history.replaceState({}, "Crumbles", newPath);
  },


  getPhraseFromUrl: function() {
    var params = _.chain( location.search.slice(1).split('&') )
    .map(function(item) { if (item) return item.split('='); })
      .compact()
    .object()
    .value();
    var phrase = params["q"];
    if (phrase === undefined) {
      return "Hello and welcome!";
    } else {
      return decodeURIComponent(phrase);
    }
  },


}
