class Homophone < ActiveRecord::Base
  validates :name, presence: true, uniqueness: { scope: :dictionary_id }
  validates :entry_id, presence: true
  validates :dictionary_id, presence: true
  validate :entry_in_dictionary

  belongs_to :entry
  belongs_to :dictionary




  private

  def entry_in_dictionary
    if self.entry
      if self.entry.dictionary_id != self.dictionary_id
        errors.add(:entry_id, "entry and homophone must be in same dictionary")
      end
    end
  end


end
