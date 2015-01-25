Crumbles::App.controllers :main do
  get :index, map: "/" do
    @title = "Crumbles"
    @description = "Crumbles are kinda like reaction GIFs with a way bigger vocabulary... and all you have to do to make one is type."
    @dictionaries = Dictionary.all
    render "index"
  end

  get :react, map: "/react" do
    render "react"
  end

  get :dictionaries, map: "/dictionaries", provides: :json do
    content_type :json
    @dictionaries = Dictionary.all
    return @dictionaries.map{|d| {name: d.name, id: d.id } }.to_json
  end

  get :dictionary, map: "/dictionary/:id", provides: :json do 
    content_type :json
    @dictionary = Dictionary.find(params[:id])
    return @dictionary.json_friendly_hash.to_json
  end

  get :tts_f, map: "/tts/f/:word" do
    content_type("audio/mpeg")
    word = params[:word]

    url = "http://translate.google.com/translate_tts"
    options = {
      ie: "UTF-8",
      tl: "en",
      q: "#{word}",
      textlen: "#{word.length}"
    }
    res = HTTParty.get(url, query: options)
    return res.parsed_response
  end


  get :tts_m, map: "/tts/m/:word" do
    content_type("audio/mp3")
    word = params[:word]

    url = "http://tts-api.com/tts.mp3"
    options = { q: "#{word}" }    
    res = HTTParty.get(url, query: options)
    return res.parsed_response
  end
end

