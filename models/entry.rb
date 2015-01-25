class Entry < ActiveRecord::Base
  validates :name, uniqueness: { scope: :dictionary_id }
  validates :dictionary_id, presence: true
  #validates :base_url, presence: true
  
  belongs_to :dictionary

  before_save :get_file_name
  

  def panda_video
    if panda_video_id
      @panda_video ||= Panda::Video.find(panda_video_id)
    end
  end

  def get_file_name
    if self.name == nil
      self.name = self.video_file_name.gsub(".mp4","")
    end
  end

  def jsonify
    if self.panda_video_id
      return {
        word: self.name,
        screenshot: self.screenshot,
        mp4: self.mp4,
        webm: self.webm
      }
    else
      return {
        word: self.name,
        screenshot: self.thumbnail_medium,
        mp4: self.base_url + ".mp4",
        webm: self.base_url + ".webm"
      }
    end
  end
 


end
