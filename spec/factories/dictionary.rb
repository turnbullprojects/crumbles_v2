FactoryGirl.define do
  factory :dictionary do
    name Forgery('lorem_ipsum').word
  end
end

