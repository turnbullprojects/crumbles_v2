require 'spec_helper'

RSpec.describe Homophone do
  describe "creation" do
    let(:dict) { create(:dictionary) }
    let(:entry) { create(:entry, dictionary_id: dict.id) } 
    let(:homophone) { create(:homophone, dictionary_id: dict.id, entry_id: entry.id)}

    context "in the same dictionary" do
      let(:duplicate) { build(:homophone, name: homophone.name, dictionary_id: dict.id, entry_id: entry.id)}

      it "should require a unique name" do
        expect(duplicate).to_not be_valid
      end

    end

    context "within a different dictionary" do
      let (:other_dictionary){ create(:dictionary, name: "Another Dictionary")}
      let(:other_entry) { create(:entry, dictionary_id: other_dictionary.id) } 
      let(:duplicate) { build(:homophone, name: homophone.name, dictionary_id: other_dictionary.id, entry_id: entry.id)}

      it "should not require a unique name" do
        expect(duplicate).to be_valid
      end

      it "should not accept an entry from another dictionary" do
        homophone.entry = other_entry
        expect(homophone).to_not be_valid
      end
    end


  end

end
