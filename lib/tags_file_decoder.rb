require 'json'
require "#{Rails.root}/app/models/tag.rb"

class TagsFileDecoder

	def initialize file
		@file = File.read(file)
	end

	def toHash
		return JSON.parse(@file)
	end

	def extractObjects video_id
		expectedParams = ["start_time", "end_time", "group", "comment"]
		tags = []

		hash = toHash

		return "The file should be an array of objects" if !hash.kind_of? Array

		hash.each do |entry|
			entry.keys.each do |key|
				return "Unsupported parameter: " + key + " found" if expectedParams.exclude? key
			end

			t = Tag.new entry
			t.video_id = video_id
			tags.push(t)
		end

		return tags
	end
end