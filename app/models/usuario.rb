class Usuario < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  enum acesso: [:guest, :membro, :uploader, :admin]
  enum status: [:ativo, :inativo, :bloqueado, :expirado]
end
