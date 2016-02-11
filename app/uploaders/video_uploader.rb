# encoding: utf-8

class VideoUploader < CarrierWave::Uploader::Base
  # Include RMagick or MiniMagick support:
  # include CarrierWave::RMagick
  # include CarrierWave::MiniMagick

  after :store, :getData

  # Choose what kind of storage to use for this uploader:
  storage :file
  # storage :fog

  def xuggler_logger
    @@xuggler_logger ||= Logger.new("#{Rails.root}/log/xuggler.log")
  end

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}"
  end

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   # For Rails 3.1+ asset pipeline compatibility:
  #   # ActionController::Base.helpers.asset_path("fallback/" + [version_name, "default.png"].compact.join('_'))
  #
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  # Process files as they are uploaded:
  # process :scale => [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  # Create different versions of your uploaded files:
  # version :thumb do
  #   process :resize_to_fit => [50, 50]
  # end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_white_list
    %w(mp4)
  end

  def filenameNoExtension
    if @nameNoExtension != nil
      return @nameNoExtension
    else
      name = @name
      @nameNoExtension ||= name[0..name.index(".")-1]
      return @nameNoExtension
    end
  end
  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  def filename
    if @name != nil
      return @name
    elsif original_filename != nil
      time = Time.now.to_i
      randChars = ('a'..'z').to_a.shuffle[0,8].join
      @name ||= randChars + time.to_s + '.' + file.extension
      return @name
    end
  end

  def getData(file)
    xugg_command = "java -jar XugglerApp/XugglerApp.jar " + "public/uploads/#{model.class.to_s.underscore}/#{mounted_as}/" + filename
    xugg_output = `#{xugg_command}`
    v = Video.where(file: filename).take
    stream = nil # VideoStreamInfo object

    isStream = false

    xugg_output.each_line do |line|
      info = line.split(':')
      if info[0] == "stream"
        if stream != nil
          stream.save!
        end
        stream = VideoStreamInfo.new
        stream.video_id = v.id
        isStream = true
        next
      end

      if isStream
        stream[info[0]] = info[1].chomp
      else
        v[info[0]] = info[1].chomp # chomp removes line break
      end
    end

    if stream != nil && stream.id == nil
      stream.save!
    end
    v.save!

    xuggler_logger.info("Video info:\n\n" + xugg_output + "\n\n===========================================\n\n")

    #extractFrames()
  end

  def extractFrames
    video_file = "public/uploads/#{model.class.to_s.underscore}/#{mounted_as}/" + filename
    frames_dir = "public/frames/" + filenameNoExtension
    FileUtils.mkdir_p(frames_dir) unless File.directory?(frames_dir)
    xugg_command = "java -jar DecodeAndCaptureFrames/DecodeAndCaptureFrames.jar \"" + video_file + "\" \"" + frames_dir + "\""
    xugg_output=`#{xugg_command}`

    xuggler_logger.info("Video frame extraction:\n\n" + xugg_output + "\n\n==============================\n\n")
  end

end
