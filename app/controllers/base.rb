Crumbles::App.controllers :main do
  get :basic, map: "/basic" do
    render "basic"
  end

  get :test, map: "/test" do
    render "test"
  end     
  get :index, map: "/" do
    cache_control :public, :max_age => 36000

    @dictionaries = Dictionary.all
    render "index"
  end

  get :react, map: "/react" do
    cache_control :public, :max_age => 36000

    render "react"
  end

  get :dictionaries, map: "/dictionaries", provides: :json do
    cache_control :public, :max_age => 36000

    content_type :json
    @dictionaries = Dictionary.all
    return @dictionaries.map{|d| {name: d.name, id: d.id } }.to_json
  end

  get :dictionary, map: "/dictionary/:id", provides: :json do 
    cache_control :public, :max_age => 36000

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

