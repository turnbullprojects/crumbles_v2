
//=require naughty_words
//=require lib/rangy-core
//=require lib/rangy-textrange
//=require lib/rangy-cssclassapplier
//=require models/entry
//=require compiled-react/word_count
//=require compiled-react/text_box
//=require compiled-react/phrase_input
//=require compiled-react/player
//=require compiled-react/word_list
//=require compiled-react/word_listing
//=require compiled-react/mashup_container
//=require compiled-react/create_app

$.get("/dictionary/4")
.done(function(data) {
  createApp(data);
});

