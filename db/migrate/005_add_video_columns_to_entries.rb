class AddVideoColumnsToEntries < ActiveRecord::Migration
  def self.up
    add_attachment :entries, :video
  end

  def self.down
    remove_attachment :entries, :video
  end
end
