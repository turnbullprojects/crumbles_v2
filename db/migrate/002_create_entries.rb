class CreateEntries < ActiveRecord::Migration
  def self.up
    create_table :entries do |t|
      t.string :name
      t.integer :dictionary_id
      t.string :base_url
      t.string :thumbnail_small
      t.string :thumbnail_medium
      t.timestamps
    end
   add_index :entries, [:dictionary_id, :name], unique: true
  end

  def self.down
    drop_table :entries
  end
end
