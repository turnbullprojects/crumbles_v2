class AddVideoDataToEntries < ActiveRecord::Migration
  def self.up
    change_table :entries do |t|
      t.string :mp4
    t.string :webm
    t.string :screenshot
    end
  end

  def self.down
    change_table :entries do |t|
      t.remove :mp4
    t.remove :webm
    t.remove :screenshot
    end
  end
end
