namespace :download do
  task :videos => :environment do
    Entry.all.each do |entry|
      name = entry.name
      dict = entry.dictionary.name.downcase
      url = entry.mp4
      res = HTTParty.get(url)
 
      File.open("/Users/air/Dropbox/dev/2015/mashup-maker/materials/video/dictionaries/#{dict}/defined/#{name}.mp4", "wb") do |file|
        file.write(res.parsed_response)
      end

      puts "#{name} for #{dict}"
    end
  end
end
