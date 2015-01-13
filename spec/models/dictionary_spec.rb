require 'spec_helper'

RSpec.describe Dictionary do
  
  describe "creation" do
    let(:dictionary){ create(:dictionary) }
    let(:duplicate_dict){ build(:dictionary, name: dictionary.name) }
    
    it "should require a unique name" do
      expect(duplicate_dict).not_to be_valid
    end
  end
  
  
  pending "has multiple entries"
  pending "has multiple homophones"
end
