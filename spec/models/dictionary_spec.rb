require 'spec_helper'

RSpec.describe Dictionary do
  
  describe "creation" do
    let(:dictionary){ create(:dictionary) }
    let(:duplicate_dict){ build(:dictionary, name: dictionary.name) }
    
    it "should require a unique name" do
      expect(duplicate_dict).not_to be_valid
    end
  end

  pending "#json_friendly_hash" 
  pending "#format_entries" 

  
end
