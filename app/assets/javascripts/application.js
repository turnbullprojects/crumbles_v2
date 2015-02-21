

//=require lib/rangy-core
//=require lib/rangy-textrange
//=require lib/rangy-cssclassapplier
//=require models/entry
//=require react/word_count
//=require react/text_box
//=require react/phrase_input
//=require react/player
//=require react/character_list
//=require react/word_list
//=require react/word_listing
//=require react/mashup_container
//=require react/create_app

$.get('/assets/dictionaries/standard.json', function(data){
  globalDict = data;
  createApp(data);
})

