namespace :words do
  task :get_male_voice => :environment do
    downloaded = File.open("#{Padrino.root}/corpus/corncob_lowercase_downloaded.txt", "a")
    File.open("#{Padrino.root}/corpus/text/corncob_lowercase.txt").each_with_index do |word,i|
      url = "http://tts-api.com/tts.mp3"
      options = { q: "#{word}" }    
      res = HTTParty.get(url, query: options)
 
      File.open("#{Padrino.root}/speech/male/#{word}.mp3", "wb") do |file|
        file.write(res.parsed_response)
      end

      downloaded.puts word
      puts word
      if (i % 30 == 0)
        sleep 2
      end
    end
  end
end
