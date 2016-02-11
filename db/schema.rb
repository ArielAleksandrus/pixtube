# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151207010314) do

  create_table "tags", force: :cascade do |t|
    t.integer  "video_id",   limit: 4
    t.integer  "start_time", limit: 4,   default: 0
    t.integer  "end_time",   limit: 4,   default: 0
    t.string   "group",      limit: 255,             null: false
    t.string   "comment",    limit: 255
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
  end

  add_index "tags", ["video_id"], name: "index_tags_on_video_id", using: :btree

  create_table "usuarios", force: :cascade do |t|
    t.string   "email",                  limit: 255, default: "", null: false
    t.string   "encrypted_password",     limit: 255, default: "", null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,   default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.string   "nome",                   limit: 255,              null: false
    t.string   "username",               limit: 255,              null: false
    t.date     "nascimento"
    t.integer  "acesso",                 limit: 4,   default: 0
    t.integer  "status",                 limit: 4,   default: 0
    t.datetime "created_at",                                      null: false
    t.datetime "updated_at",                                      null: false
  end

  add_index "usuarios", ["email"], name: "index_usuarios_on_email", unique: true, using: :btree
  add_index "usuarios", ["reset_password_token"], name: "index_usuarios_on_reset_password_token", unique: true, using: :btree
  add_index "usuarios", ["username"], name: "index_usuarios_on_username", unique: true, using: :btree

  create_table "video_stream_infos", force: :cascade do |t|
    t.string   "language",       limit: 255
    t.string   "timebase",       limit: 255
    t.string   "coder_timebase", limit: 255
    t.integer  "width",          limit: 4
    t.integer  "height",         limit: 4
    t.string   "format",         limit: 255
    t.decimal  "frame_rate",                 precision: 5, scale: 2
    t.integer  "duration",       limit: 4
    t.string   "codec_type",     limit: 255
    t.string   "codec",          limit: 255
    t.integer  "start_time",     limit: 4
    t.integer  "sample_rate",    limit: 4
    t.integer  "channels",       limit: 4
    t.integer  "video_id",       limit: 4
    t.datetime "created_at",                                         null: false
    t.datetime "updated_at",                                         null: false
  end

  add_index "video_stream_infos", ["video_id"], name: "index_video_stream_infos_on_video_id", using: :btree

  create_table "videos", force: :cascade do |t|
    t.string   "title",      limit: 255,               null: false
    t.text     "desc",       limit: 65535
    t.string   "file",       limit: 255
    t.string   "poster",     limit: 255
    t.integer  "views",      limit: 4,     default: 0
    t.integer  "likes",      limit: 4,     default: 0
    t.integer  "dislikes",   limit: 4,     default: 0
    t.integer  "status",     limit: 4,     default: 0
    t.integer  "usuario_id", limit: 4
    t.integer  "duration",   limit: 4
    t.integer  "start_time", limit: 4
    t.integer  "file_size",  limit: 4
    t.integer  "bit_rate",   limit: 4
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
  end

  add_index "videos", ["usuario_id"], name: "index_videos_on_usuario_id", using: :btree

  add_foreign_key "tags", "videos"
  add_foreign_key "video_stream_infos", "videos"
  add_foreign_key "videos", "usuarios"
end
