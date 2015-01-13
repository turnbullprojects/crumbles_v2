class Dictionary < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true
  has_many :entries
  has_many :homophones


end
