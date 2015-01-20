class AddPandaVideoIdToEntries < ActiveRecord::Migration
  def self.up
    change_table :entries do |t|
      t.string :panda_video_id
    end
  end

  def self.down
    change_table :entries do |t|
      t.remove :panda_video_id
    end
  end
end
