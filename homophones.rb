require 'mechanize'

agent = Mechanize.new
agent.user_agent_alias = 'Mac Safari'

f = File.open("homophones.txt", "a")

(402..1320).each do |n|

  begin
    resp = agent.get("http://www.homophone.com/h/#{n}")
    text = resp.at("h3").text
    puts "#{n}) #{text}"
    f.puts text
    if(n % 3 == 0)
      sleep(1)
    end
  rescue
    puts "#{n}) is a 404"
  end

end
f.close



