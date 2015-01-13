class CreateHomophones < ActiveRecord::Migration
  def self.up
    create_table :homophones do |t|
      t.string :name
      t.integer :entry_id
      t.integer :dictionary_id
      t.timestamps
    end
    add_index :homophones, [:dictionary_id, :name], unique: true
  end

  def self.down
    drop_table :homophones
  end
end
