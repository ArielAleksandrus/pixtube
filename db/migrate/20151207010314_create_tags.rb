class CreateTags < ActiveRecord::Migration
  def change
    create_table :tags do |t|
      t.references :video, index: true, foreign_key: true
      t.integer :start_time, default: 0
      t.integer :end_time, default: 0
      t.string :group, null: false
      t.string :comment

      t.timestamps null: false
    end
  end
end
