require 'spec_helper'

RSpec.describe Entry do

  describe "creation" do
    let(:dict) { create(:dictionary) }
    let(:entry) { create(:entry, dictionary_id: dict.id) } 

    context "in the same dictionary" do
      let(:duplicate_entry) { build(:entry, name: entry.name, dictionary_id: dict.id) } 

      it "should require a unique name" do
        expect(duplicate_entry).to_not be_valid
      end

    end

    context "within a different dictionary" do
      let (:other_dictionary){ create(:dictionary, name: "Another Dictionary")}
      let(:duplicate_entry) { build(:entry, name: entry.name, dictionary_id: other_dictionary.id) } 

      it "should not require a unique name" do
        expect(duplicate_entry).to be_valid
      end
    end

  end


end
