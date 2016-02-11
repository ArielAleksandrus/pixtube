require "#{Rails.root}/lib/tags_file_decoder.rb"
class VideosController < ApplicationController
	before_filter -> {authenticate_usuario! ['uploader', 'admin']}, only: ['upload', 'uploaded']

	def list
		if current_usuario != nil && current_usuario.acesso == "admin" 
			@videos = Video.all.reverse
			render 'listvideo'
		else
			@videos = Video.last(5).reverse
			render 'listvideo2'
		end
	end

	def changePoster
		@video = Video.find(params[:id])
		render 'change_poster'
	end
	def posterUpload
		params[:id] = params[:id].to_i
		if params[:id] < 1 || params[:id] == nil
			render json: {status: 'error', message: 'Video does not exist'}
			return
		end
		
		poster = params[:poster]

		v = Video.find(params[:id])
		v.poster = poster

		if v.save!
			render json: {status: 'success'}
		else
			render json: {status: 'error', message: 'Object could not be updated'}
		end
	end

	def changeTags
		@video = Video.find(params[:id])
		render 'change_tags'
	end
	def tagsUpload
		params[:id] = params[:id].to_i

		if params[:id] < 1 || params[:id] == nil
			render json:{status: 'error'}
			return
		end

		tagfile = params.permit(:tagfile)[:tagfile]
		x = TagsFileDecoder.new(tagfile.tempfile)

		old_tags = Tag.where(video_id: params[:id]).all
		old_tags.each do |old_tag|
			old_tag.destroy
		end

		new_tags = x.extractObjects(params[:id])

		new_tags.each do |new_tag|
			new_tag.save!
		end

		render json:{status: 'success'}
	end

	def uploadIndex
		@video = Video.new
		render 'sendvideo'
	end
	def upload
		v = Video.new(video_params)
		v.usuario_id = current_usuario.id
		if v.save!
			redirect_to action: "changePoster", id: v.id
		else
			flash[:error] = "Erro! O envio não pôde ser concluído"
			render 'sendvideo'
		end
	end

	def watch
		@video = Video.find(params[:id])
		render 'watch'
		@video.views += 1
		@video.save!
	end

	def video_params
		params.require(:video).permit(:title, :desc, :file, :poster)
	end
end