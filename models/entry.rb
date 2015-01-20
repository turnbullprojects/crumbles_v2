class Entry < ActiveRecord::Base
  #include Paperclip::Glue
  #include DelayedPaperclip::Glue

  #has_attached_file :video, 
  #  storage: :s3,
  #  s3_credentials: Proc.new{ |a| a.instance.s3_credentials },
  #  styles: { 
  #    mp4: { geometry: "640x480", format: 'mp4' },
  #    webm: { geometry: "640x480", format: 'webm' },
  #    cover: { geometry: "640x480", format: 'jpg', time: 0 },
  #    thumb: { geometry: "128x96", format: 'jpg', time: 0 }
  #  }, processors: [:transcoder]
  #process_in_background :video
  #validates_attachment_content_type :video, content_type: /\Avideo\/.*\Z/

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

  def s3_credentials
    { 
      bucket: ENV['AWS_BUCKET'],
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
    }       
  end




end
