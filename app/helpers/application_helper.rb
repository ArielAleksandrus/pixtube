module ApplicationHelper
	def is_number?(obj)
		obj.to_s == obj.to_i.to_s
  end
  
  # remember to use <%== js_echo_var(variable) %> for strings and chars
  # and <%= js_echo_var(variable) %> for numbers, nil, etc.
  def js_echo_var(var)
  	return "null" if var == nil
    if var.is_a? String
      return "'#{var}'"
  	elsif [Date, DateTime, Time].include? var.class
      return "'#{var.strftime("%Y-%m-%d %H:%M:%S")}'"
    elsif var.is_a? CarrierWave::Uploader::Base
      if var.size == 0
        return "null"
      else
        return "'#{var}'"
      end
    end
  	return var
  end
end
