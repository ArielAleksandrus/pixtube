class TagsController < ApplicationController
	def newTag
		t = Tag.new(tag_params)
		t.video_id = params[:id]

		if t.save!
			render json: {status: 'success'}
		else
			render json: {status: 'error'}
		end
		
	end

	def tag_params
		p = params.permit(:start_time, :end_time, :comment, :group)
		if p[:group] == ''
			p[:group] = 'Outros'
		end
		return p
	end
end
