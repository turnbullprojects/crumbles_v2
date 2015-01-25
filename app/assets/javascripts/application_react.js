
//=require lib/rangy-core
//=require lib/rangy-textrange
//=require lib/rangy-cssclassapplier
//=require lib/underscore-min

//=require modules/sanitizer
//=require modules/chainable_sanitizer

//=require models/entry

//=require react/word_count
//=require react/text_box
//=require react/phrase_input
//=require react/player
//=require react/word_list
//=require react/word_listing
//=require react/master

$.get("/dictionary/2")
.done(function(data) {
  Dict = data;
  React.render(
    <MashupContainer dictionary={data} />, 
    document.getElementById("main")
  );

});

