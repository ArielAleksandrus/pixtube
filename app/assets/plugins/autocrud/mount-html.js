var _autocrud_mount_html = null;
(function(){
	var helper = globalUtils.helpers;
	function getAttrs(element){
		// for name property
		var arrayIdx = (!!element.parentEl && element.parentEl.array == true) ? "[{{$parent.$parent.$parent.$parent.$index}}]" : ((element.array == true) ? "[{{$index}}]" : "");
		var res = " name='" + element.name + arrayIdx + "' ";

		// css class is form-control by default.
		if(element.chars.attrs.class == undefined)
			res += "class='form-control' ";
		// for error messages (displayed as popover)
		var alias = !!element.parentEl ? 'c' : 'e';
		res += "uib-popover='{{helper.joinStrings(\"\n\", " + alias + ".error)}}' popover-placement='top' \
		popover-trigger='none'\
		popover-is-open='fCtrl[\"form\" + fCtrl.activeTabIndex][" + alias + ".name" + (arrayIdx.length > 0 ? " + \"" + arrayIdx + "\"" : "") + "].$invalid' ";

		// for any other property
		for(var prop in element.chars.attrs){
			res += prop + "='" + element.chars.attrs[prop] + "' ";
		}
		return res;
	}
	function mountCustom(element, model){
		if(typeof element.html != 'string')
			throw "Autocrud: custom element '" + element.name + "'' must have an html property with a string value! Current value is " + (typeof element.html) + " and the value is: " + element.html;
		return element.html.replace("replace-model", model);
	}
	function mountDate(element, attrs, model, mode){
		var hasTime = mode == 'datetime' || mode == 'time';
		var hasDate = mode == 'datetime' || mode == 'date';
		var format = !!element.format ? element.format : (hasDate ? "dd/MM/yyyy " : "") + (hasTime ? "HH:mm:ss" : "");
		var openedDP = "openedDP[e.name]";
		if(!!element.parentEl){
			if(!!element.parentEl.array)
				openedDP = "openedDP[c.name][$parent.$parent.$parent.$parent.$index]";
			else
				openedDP = "openedDP[c.name]";
		} else {
			if(element.array)
				openedDP = "openedDP[e.name][$index]";
		}
		var disabled = "";
		if(attrs.indexOf('readonly') > -1 || attrs.indexOf('disabled') > -1)
			disabled = "disabled";
		return "<span class='input-group'>\
			<input type='text'" + model + attrs + " is-open='" + openedDP + "' \
			 enable-date='" + hasDate + "' enable-time='" + hasTime + "' datetime-picker='" + format + "' datepicker-to-iso/> \
			<span class='input-group-btn'> \
				<button type='button' class='btn btn-default' ng-click='" + openedDP + " = !" + openedDP + "' " + disabled + "> \
					<i class='glyphicon glyphicon-calendar'></i> \
				</button> \
			</span> \
		</span>";
	}
	function mountFile(element, attrs){
		var model = " ng-model='" + (!!element.parentEl ? 'c' : 'e') + ".auxModel";
		if(!!element.parentEl && element.parentEl.array == true)
			model += "[$parent.$parent.$parent.$parent.$index]";
		else if(element.array == true)
			model += "[parentIndex]";
		model += "' ";
		return "<input type='file'" + model + attrs + " base-sixty-four-input />";
	}
	function mountPrice(element, attrs, model){
			return "<div class='input-group'> \
				<div class='input-group-btn'> \
					<button type='button' class='btn btn-default'> \
						<i class='glyphicon glyphicon-usd'></i> \
					</button> \
				</div> \
				<input type='text'" + model + attrs + " \
			</div>";
	}
	function mountSelect(element, attrs, model, alias){
		return "<select" + model + attrs + " ng-options='item.value as item.label for item in " + alias + ".options'></select>";
	}
	function mountSimpleInput(element, attrs, type, model){
		return "<input type='" + type + "'" + model + attrs + "/>";
	}
	function mountTextArea(element, attrs, model){
		return "<textarea" + model + attrs + "></textarea>";
	}
	function mountTypeahead(element, attrs, model, alias){
		return "<input type='text'" + model + attrs + " \
		uib-typeahead=\"item.value as item.label for item in " + alias + ".options | filter: $viewValue | orderBy: 'label'\" \
		typeahead-input-formatter=\"formatLabel($model, " + alias + ")\" typeahead-editable='false' typeahead-select-on-exact='true' \
		ng-init=\"formatLabel($model, " + alias + ")\" />";
	}
	// chars stands for Characteristics.
	_autocrud_mount_html = function(element){
		var alias = null;
		var itemPath = "[e.name]";
		if(!!element.parentEl){
			alias = 'c';
			if(element.parentEl.array)
				itemPath += "[$parent.$parent.$parent.$index]";
			itemPath += "[c.name]";
		} else {
			alias = 'e';
			if(!!element.array)
				itemPath += "[$index]";
		}

		var model = " ng-model='fCtrl.curItem" + itemPath + "'";
		var attrs = getAttrs(element);
		var mode = element.chars.mode;
		switch(mode){
			case 'custom':
				return mountCustom(element, model);
			case 'date':
			case 'datetime':
			case 'time':
				return mountDate(element, attrs, model, mode);
			case 'file':
			case 'file/image':
				return mountFile(element, attrs);
			case 'int':
			case 'float':
			case 'number':
				mode = 'number';
				break;
			case 'price':
				return mountPrice(element, attrs, model);
			case 'select':
				return mountSelect(element, attrs, model, alias);
			case 'textarea':
				return mountTextArea(element, attrs, model);
			case 'typeahead':
				return mountTypeahead(element, attrs, model, alias);
		}
		return mountSimpleInput(element, attrs, element.chars.mode, model);
	};
})();