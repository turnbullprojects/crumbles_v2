require 'json'
namespace :s3 do
  task :update_dictionaries => :environment do
    puts "Syncing with S3..."
    s3 = AWS::S3.new
    bucket = s3.buckets['crumbles-2015']
    dictionary_path = "resources/video/dictionaries/"
    dictionaries = ["standard", "bee_and_puppycat", "homer_simpson"]


    result = []

    dictionaries.each do |dictionary|
      entries = []
      puts "Working on #{dictionary}"
      defined = bucket.objects.with_prefix("#{dictionary_path}#{dictionary}/defined/")
      defined.each do |entry|
        file = File.basename(entry.key, ".*")
        puts file
        entries << file 
      end
      this_dict = { name: dictionary, entries: entries }
      result << this_dict
    end

    result.each do |dict|
      f = File.open("app/assets/javascripts/dictionaries/#{dict[:name]}.json", "w")
      f.puts dict.to_json
      f.close
    end

  end
end
 
