require 'factory_girl'
require 'forgery'
require 'database_cleaner'

RACK_ENV = 'test' unless defined?(RACK_ENV)
require File.expand_path(File.dirname(__FILE__) + "/../config/boot")
Dir[File.expand_path(File.dirname(__FILE__) + "/../app/helpers/**/*.rb")].each(&method(:require))

FactoryGirl.definition_file_paths = [File.expand_path('../factories', __FILE__)]
FactoryGirl.find_definitions

RSpec.configure do |conf|
  conf.color = true

  conf.include Rack::Test::Methods

  conf.include FactoryGirl::Syntax::Methods

  conf.before(:suite) do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with(:truncation)
  end
  conf.after(:each) do
    DatabaseCleaner.clean_with(:truncation)
  end

  
end

# You can use this method to custom specify a Rack app
# you want rack-test to invoke:
#
#   app CrumblesV2::App
#   app CrumblesV2::App.tap { |a| }
#   app(CrumblesV2::App) do
#     set :foo, :bar
#   end
#
def app(app = nil, &blk)
  @app ||= block_given? ? app.instance_eval(&blk) : app
  @app ||= Padrino.application
end
