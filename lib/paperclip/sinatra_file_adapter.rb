module Paperclip
  class SinatraFileAdapter < AbstractAdapter

    def initialize(target)
      @target = target[:tempfile]
      cache_current_values(target)
    end

    private

    def cache_current_values(target)
      self.original_filename = target[:filename]
      self.original_filename ||= File.basename(@target.path)
      @tempfile = copy_to_tempfile(@target)
      @content_type = Paperclip::ContentTypeDetector.new(@target.path).detect
      @size = File.size(@target)
    end

  end
end

Paperclip.io_adapters.register Paperclip::SinatraFileAdapter do |target|
  begin
   target.is_a?(Hash) && Tempfile === target[:tempfile]
  rescue => e
    false
  end
end
