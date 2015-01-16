
//=require lib/rangy-core
//=require lib/rangy-textrange
//=require lib/rangy-cssclassapplier
//=require react/word_count
//=require react/text_box
//=require react/phrase_input
//=require react/player
//=require react/mashup_container
//=require standard

React.render(
  <MashupContainer dictionary={StandardDict} />, 
  document.getElementById("main")
);

