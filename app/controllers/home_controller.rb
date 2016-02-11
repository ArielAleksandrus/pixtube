class HomeController < ApplicationController
	def getIndex
		if current_usuario == nil
			return render "guest"
		end

		case current_usuario.acesso
		when "guest"
			render "guest"
		when "membro"
			render "membro"
		when "uploader"
			render "uploader"
		when "admin"
			render "admin"
		end
	end
end
