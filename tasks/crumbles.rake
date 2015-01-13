namespace :crumbles do
  task :seed => :environment do
    puts "Clearing database"
    Homophone.destroy_all
    Entry.destroy_all
    Dictionary.destroy_all

    puts "Seeding database"
    Dir[File.expand_path("#{Padrino.root}/db/v1_data/*.json")].each do |file|
      raw = File.read(file)
      parsed = JSON.parse(raw)

      if parsed["entries"]
        # We're dealing with standard.json
        puts "Dictionary name is #{parsed["dictionary"]}"
        dict = Dictionary.create(name: parsed["dictionary"])

        entries = parsed["entries"]

        entries.each do |k,v|
          puts "Creating word #{k} in the #{dict.name} dictionary"
          dict.entries.create(name: k, 
                              base_url: v["mp4"].gsub(".mp4",""), 
                              thumbnail_medium: v["thumbnail"],
                              thumbnail_small: v["thumbnail"].gsub("medium","low")
                             )
        end

      else
        # we're dealing with bee or homer
        puts "Dictionary name is #{parsed["dictionary"]["name"]}"
        dict = Dictionary.create(name: parsed["dictionary"]["name"])

        entries = parsed["dictionary"]["entries"]

        entries.each do |entry|
          k = entry.keys.first
          v = entry.values.first
          puts "Creating word #{k} in the #{dict.name} dictionary"
          dict.entries.create(name: k, 
                              base_url: v["mp4"].gsub(".mp4",""), 
                              thumbnail_medium: v["thumbnail"],
                              thumbnail_small: v["thumbnail"].gsub("medium","low")
                             )

        end     
      end
    end
  end
end
