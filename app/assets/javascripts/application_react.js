
//=require lib/rangy-core
//=require lib/rangy-textrange
//=require lib/rangy-cssclassapplier
//=require react/word_count
//=require react/text_box
//=require react/phrase_input
//=require react/player
//=require react/word_list
//=require react/word_listing
//=require react/mashup_container

$.get("/dictionary/2")
.done(function(data) {
  console.log(data);

  React.render(
    <MashupContainer dictionary={data} />, 
    document.getElementById("main")
  );

});

