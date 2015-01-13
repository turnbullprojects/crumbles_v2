class Homophone < ActiveRecord::Base
  validates :name, presence: true, uniqueness: { scope: :dictionary_id }
  validates :entry_id, presence: true
  validates :dictionary_id, presence: true

  belongs_to :entry
  belongs_to :dictionary

end
