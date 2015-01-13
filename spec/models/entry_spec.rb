require 'spec_helper'

RSpec.describe Entry do

  describe "creation" do
    context "in the same dictionary" do
      let(:dict) { create(:dictionary) }
      let(:entry) { create(:entry, dictionary_id: dict.id) } 


      let(:duplicate_entry) { build(:entry, name: entry.name, dictionary_id: dict.id) } 

      it "should require a unique name" do
        expect(duplicate_entry).to_not be_valid
      end
    end

    context "within a different dictionary" do
      let(:dict) { create(:dictionary, name: "Dictionary One") }
      let(:entry) { create(:entry, dictionary_id: dict.id) } 


      let (:other_dictionary){ create(:dictionary, name: "Another Dictionary")}
      let(:duplicate_entry) { build(:entry, name: entry.name, dictionary_id: other_dictionary.id) } 

      it "should not require a unique name" do
        expect(duplicate_entry).to be_valid
      end
    end


  end


  pending "has homophones"
  pending "only has homophones that are in the same dictionary"
  pending "validates name uniqueness scoped to dictionary"
  pending "validates base_url"
  pending "thumbnails are optional"
end
