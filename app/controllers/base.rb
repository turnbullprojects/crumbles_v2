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

  get :dictionary, map: "/dictionary/:dictionary" do 
    content_type :json
    @dictionary = Dictionary.find_by_name(params[:dictionary]) || Dictionary.new
    return @dictionary.json_friendly_hash.to_json
  end

  get :tts_f, map: "/tts/f/:word" do
    content_type("audio/mp3")
    word = params[:word]

    url = "http://translate.google.com/translate_tts"
    options = {
      ie: "UTF-8",
      tl: "en",
      q: "#{word}",
      textlen: "#{word.length}"
    }
    res = HTTParty.get(url, query: options)
    return res
  end


  get :tts_m, map: "/tts/m/:word" do
    content_type("audio/mp3")
    word = params[:word]

    url = "http://tts-api.com/tts.mp3"
    options = {
      q: "#{word}"
    }    

    res = HTTParty.get(url, query: options)
    if res.code == 200
      speech = Base64.encode64(res.parsed_response)
    end
    return res
  end
end

