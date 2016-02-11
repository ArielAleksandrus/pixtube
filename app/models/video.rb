class Video < ActiveRecord::Base
  belongs_to :usuario

  mount_uploader :file, VideoUploader
  mount_base64_uploader :poster, PictureUploader
  
  enum status: [:active, :deleted, :hidden]

  has_many :video_stream_infos
  has_many :tags

  def tagfile
  	mount_uploader :tagfile, TagfileUploader
  end
end
