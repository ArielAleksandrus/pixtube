class CreateVideos < ActiveRecord::Migration
  def change
    create_table :videos do |t|
      t.string :title, null: false
      t.text :desc
      t.string :file
      t.string :poster
      t.integer :views, default: 0
      t.integer :likes, default: 0
      t.integer :dislikes, default: 0
      t.integer :status, default: 0
      t.references :usuario, index: true, foreign_key: true

      # Info xuggler shall provide
      t.integer :duration
      t.integer :start_time
      t.integer :file_size
      t.integer :bit_rate

      t.timestamps null: false
    end
  end
end
