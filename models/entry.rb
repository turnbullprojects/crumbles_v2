class Entry < ActiveRecord::Base

  validates :name, presence: true, uniqueness: { scope: :dictionary_id }
  validates :dictionary_id, presence: true
  validates :base_url, presence: true
  
  belongs_to :dictionary


end
