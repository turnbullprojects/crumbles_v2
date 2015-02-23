require 'json'
namespace :import do
  task :dictionaries => :environment do
    puts "Syncing with S3..."
    s3 = AWS::S3.new
    bucket = s3.buckets['crumbles-2015']
    dictionary_path = "resources/video/dictionaries/"
    dictionaries = ["standard", "bee_and_puppycat", "homer_simpson"]


    result = []

    dictionaries.each do |dictionary|
      entries = {}
      puts "Working on #{dictionary}"
      defined = bucket.objects.with_prefix("#{dictionary_path}#{dictionary}/defined/")
      defined.each do |entry|
        file = File.basename(entry.key, ".*")
        screenshot = "https://crumbles-2015.s3.amazonaws.com/resources/images/dictionaries/#{dictionary}/#{file}.jpg"
        puts file
        entries[file] = { word: file, screenshot: screenshot }
      end
      this_dict = { voice: "male", dictionary: dictionary, entries: entries }
      result << this_dict
    end

    result.each do |dict|
      f = File.open("app/assets/javascripts/dictionaries/#{dict[:dictionary]}.json", "w")
      f.puts dict.to_json
      f.close
    end

  end
end
 
