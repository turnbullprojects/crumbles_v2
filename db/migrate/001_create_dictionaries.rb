class CreateDictionaries < ActiveRecord::Migration
  def self.up
    create_table :dictionaries do |t|
      t.string :name
      t.timestamps
    end
    add_index :dictionaries, :name, unique: true
  end

  def self.down
    drop_table :dictionaries
  end
end
