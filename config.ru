#!/usr/bin/env rackup
# encoding: utf-8

# This file can be used to start Padrino,
# just execute it from the command line.

require File.expand_path("../config/boot.rb", __FILE__)

map '/assets' do
  run Padrino::Assets.environment
end
Sprockets.append_path('/dictionaries/')
require 'resque/server'

run Rack::URLMap.new \
  "/"       => Padrino.application,
  "/resque" => Resque::Server.new

run Padrino.application
