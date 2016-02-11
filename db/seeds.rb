# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Usuario.create!([
  {email: "aluno1@mail.com", username: "aluno1", nome: 'Aluno Um', nascimento: '1993-02-10', status: :ativo, acesso: :membro, password: "aluno1", password_confirmation: "aluno1", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, sign_in_count: 1, current_sign_in_at: "2015-02-06 14:02:10", last_sign_in_at: "2015-02-06 14:02:10", current_sign_in_ip: "127.0.0.1", last_sign_in_ip: "127.0.0.1"},
  {email: "aluno2@mail.com", username: "aluno2", nome: 'Aluno Dois', nascimento: '1994-03-05', status: :ativo, acesso: :membro, password: "aluno2", password_confirmation: "aluno2", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, sign_in_count: 1, current_sign_in_at: "2015-02-06 14:03:01", last_sign_in_at: "2015-02-06 14:03:01", current_sign_in_ip: "127.0.0.1", last_sign_in_ip: "127.0.0.1"},
  {email: "aluno3@mail.com", username: "aluno3", nome: 'Aluno Três', nascimento: '1992-01-20', status: :ativo, acesso: :membro, password: "aluno3", password_confirmation: "aluno3", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, sign_in_count: 1, current_sign_in_at: "2015-02-06 14:03:44", last_sign_in_at: "2015-02-06 14:03:44", current_sign_in_ip: "127.0.0.1", last_sign_in_ip: "127.0.0.1"},
  {email: "aluno4@mail.com", username: "aluno4", nome: 'Aluno Quatro', nascimento: '1992-01-20', status: :ativo, acesso: :membro, password: "aluno4", password_confirmation: "aluno4", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, sign_in_count: 1, current_sign_in_at: "2015-02-06 14:03:44", last_sign_in_at: "2015-02-06 14:03:44", current_sign_in_ip: "127.0.0.1", last_sign_in_ip: "127.0.0.1"},
  {email: "professor1@mail.com", username: "professor1", nome: 'Professor Um', nascimento: '1992-01-20', status: :ativo, acesso: :admin, password: "professor1", password_confirmation: "professor1", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, sign_in_count: 1, current_sign_in_at: "2015-02-06 14:03:44", last_sign_in_at: "2015-02-06 14:03:44", current_sign_in_ip: "127.0.0.1", last_sign_in_ip: "127.0.0.1"},
  {email: "professor2@mail.com", username: "professor2", nome: 'Professor Dois', nascimento: '1992-01-20', status: :ativo, acesso: :uploader, password: "professor2", password_confirmation: "professor2", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, sign_in_count: 1, current_sign_in_at: "2015-02-06 14:03:44", last_sign_in_at: "2015-02-06 14:03:44", current_sign_in_ip: "127.0.0.1", last_sign_in_ip: "127.0.0.1"},
  {email: "professor3@mail.com", username: "professor3", nome: 'Professor Três', nascimento: '1992-01-20', status: :ativo, acesso: :uploader, password: "professor3", password_confirmation: "professor3", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, sign_in_count: 1, current_sign_in_at: "2015-02-06 14:03:44", last_sign_in_at: "2015-02-06 14:03:44", current_sign_in_ip: "127.0.0.1", last_sign_in_ip: "127.0.0.1"},
])

Video.create!([
	{title: "title 1", desc: "desc 1", file: open("/home/aleksandrus/Videos/Google I-O 2013 - Design Decisions in AngularJS.mp4"), poster: open("/home/aleksandrus/Pictures/Swamp Man/eu nao kero.jpg"), duration: 1500000, usuario_id: 5},
])
Tag.create!([
  {video_id: 1, start_time: 0, end_time: 8000, group: "Apresentação", comment: "Apresentação dos palestrantes"},
  {video_id: 1, start_time: 38000, end_time: 130000, group: "Introdução", comment: "Princípios do desenvolvimento WEB"},
  {video_id: 1, start_time: 139000, end_time: 260000, group: "Introdução", comment: "Origem do Angular"},
  {video_id: 1, start_time: 10000, end_time: 330000, group: "Introdução", comment: "Introdução à framework"},
  {video_id: 1, start_time: 330000, end_time: 422000, group: "Exemplos", comment: "Primeiro exemplo"},
  {video_id: 1, start_time: 334000, end_time: 495000, group: "Componentes", comment: "Explicação sobre data binding"},
  {video_id: 1, start_time: 536000, end_time: 770000, group: "Componentes", comment: "Explicação sobre controllers"},
  {video_id: 1, start_time: 778000, end_time: 865000, group: "Funcionalidades", comment: "Teste do software"},
])