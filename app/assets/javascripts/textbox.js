var createMashup = function() {
  $("#crumble-container").html("");
  console.log("creating mashup...");
  var phrase = $("#main-input").val();
  console.log("phrase is : " + phrase);
  var mashup = new Mashup(StandardDict["entries"]);
  mashup.build(phrase);


  $("#play-button").click(function(e) {
    e.preventDefault();
    mashup.playlist.play();
    $(this).hide();
  });


}

$("#the-button").click(function(e){
  e.preventDefault();
  console.log('clicked');
  createMashup();
});


$("#main-input").on("change keyup paste", function(e) {
  if(e.target.value === ''){

  }

});
