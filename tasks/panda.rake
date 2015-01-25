namespace :panda do
  task :get_urls => :environment do
    entries = Entry.where("mp4 IS NULL AND webm IS NULL")
    count = entries.count
    errors = []
 
    entries.each_with_index do |e, i|
      puts "Getting video urls for #{e.name}. #{count - i} remaining."
      encodings = e.panda_video.encodings
      e.mp4 = encodings["h264"].url
      e.webm = encodings["webm"].url
      e.screenshot = encodings["h264"].screenshots.first
      unless e.save
        errors << e
      end
    end
    puts "Done!"
    puts "Did not save the following entries:"
    errors.each { |e| puts "ID: #{e.id}, Name: #{e.name}" }
  end
end
