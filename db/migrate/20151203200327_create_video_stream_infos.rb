class CreateVideoStreamInfos < ActiveRecord::Migration
  def change
    create_table :video_stream_infos do |t|
      t.string :language
      t.string :timebase
      t.string :coder_timebase
      t.integer :width
      t.integer :height
      t.string :format
      t.decimal :frame_rate, precision: 5, scale: 2
      t.integer :duration
      t.string :codec_type
      t.string :codec
      t.integer :start_time
      t.integer :sample_rate
      t.integer :channels
      t.references :video, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
