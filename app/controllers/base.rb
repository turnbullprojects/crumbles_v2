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

    get :audio, map: "/audio/:word" do
    content_type("audio/mp3")
    word = params[:word]
    puts "hi"

    # speech = ""
    # url = "http://tts-api.com/tts.mp3?q=Hello%20World"
    # options = {
    #   q: "#{word}"
    # }    
    url = "http://translate.google.com/translate_tts"
    options = {
      ie: "UTF-8",
      tl: "en",
      q: "#{word}",
      textlen: "#{word.length}"
    }
    res = HTTParty.get(url, query: options)
    logger.info res
    if res.code == 200
      speech = Base64.encode64(res.parsed_response)
    end
    return res
  end


end

