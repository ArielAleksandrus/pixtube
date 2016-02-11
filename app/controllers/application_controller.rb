class ApplicationController < ActionController::Base
  include ApplicationHelper
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  protected
	  def authenticate_usuario!(acesso)
	    if !usuario_signed_in?
	      redirect_to '/logout'
	    end
	    if acesso.kind_of?(Array)
	    	found = false
	    	acesso.each do |a|
	    		if current_usuario.acesso == a
	    			found = true
	    			break
	    		end
	    	end
	    	if !found
	    		redirect_to '/logout'
	    	end
	    else
	    	if current_usuario.acesso != acesso
	    		redirect_to '/logout'
	    	end
	    end
	  end
end
