var _autocrud_prepare_inputs = null;
(function(){
	var helper = globalUtils.helpers;
	function handleDescription(desc, element){
		var res = {};

		// the first string of description was already handled in "getCharacteristics" function.
		for(var i = 1; i < desc.length; i++){
			if(typeof desc[i] !== 'string')
				continue;
			var attr = [];
			if(desc[i].indexOf('=') > -1)
				attr = desc[i].split('=');
			else
				attr = [desc[i], desc[i]];

			switch(attr[0]){
				// handle any autocrud-specific attrs and attrs that need some refinement (as pattern/ng-pattern).
				case 'image':
					res.accept = 'image/gif, image/jpeg, image/png';
					break;

				case 'mindate':
				case 'maxdate':
					var mode = attr[0] == 'mindate' ? 'min-date' : 'max-date';
					if(isNaN(attr[1])){
						var addTime = 0;
						var subattr = attr[1].split('-');
						subattr[0] = parseInt(subattr[0]);
						if(attr[1].indexOf('day') > -1){
							addTime = subattr[0]*1000*60*60*24;
						}
						if(attr[1].indexOf('week') > -1){
							addTime = subattr[0]*1000*7*60*60*24;
						}
						else if(attr[1].indexOf('month') > -1){
							addTime = subattr[0]*1000*30*60*60*24;
						}
						else if(attr[1].indexOf('year') > -1){
							addTime = subattr[0]*1000*12*30*60*60*24;
						}
						res[mode] = (mode == 'min-date' ? (new Date((new Date()).getTime() - addTime)).getTime() : (new Date((new Date()).getTime() + addTime).getTime()));
					} else {
						res[mode] = attr[1];
					}
					break;
				case 'no-repeat':
					if(!!element){
						if(!!element.error){
							if(typeof element.error == 'string')
								element.error = [element.error];
							if(element.error.indexOf(element.label + " não pode ter valor repetido!") == -1)
								element.error.push(element.label + " não pode ter valor repetido!");
						} else {
							element.error = element.label + " não pode ter valor repetido!";
						}
					}
					res['no-repeat'] = 'fCtrl.curItem';
					break;
				case 'nofuture':
					res['max-date'] = (new Date()).getTime();
					break;
				case 'nopast':
					res['min-date'] = (new Date()).getTime();
					break;
				case 'pattern':
				case 'ng-pattern':
					res['ng-pattern'] = new RegExp(attr[1]);
					break;
				case 'required':
				case 'ng-required':
					res.required = "required";
					break;
				default:
					res[attr[0]] = attr[1];
			}
		}
		return res;
	};
	function getCharacteristics(element){
		function stringOptionsToObjects(options){
			if(!!options[0] && typeof options[0] == 'string'){
				var aux = [];
				for(var i in options){
					aux.push({
						label: options[i],
						value: options[i]
					});
				}
				return aux;
			} else {
				return options;
			}
		}
		var res = {};
		res.attrs = handleDescription(element.description, element);
		res.mode = element.description[0];
		switch(element.description[0]){
			case 'id':
				break;
			case 'checkbox':
				res.type = 'checkbox';
			case 'custom':
				break;
			case 'date':
				res.type = 'text';
				break;
			case 'datetime':
				res.type = 'text';
				break;
			case 'email':
				res.type = 'text';
				if(!res.attrs['ng-pattern'])
					res.attrs['ng-pattern'] = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
				break;
			case 'file':
				if(element.description[1] == 'image')
					res.mode = 'file/image';
				res.tag = 'input';
				res.type = 'file';
				if(element.array || (!!element.parentEl && element.parentEl.array))
					element.auxModel = [];
				else
					element.auxModel = null;
				filesModelName = res.name;
				break;
			case 'float':
			case 'number':
				res.type = 'number';
				if(!res.attrs['ng-pattern'])
					res.attrs['ng-pattern'] = /^[0-9]+(\.[0-9]+){0,1}$/;
				break;
			case 'int':
				res.type = 'number';
				if(!res.attrs['ng-pattern'])
					res.attrs['ng-pattern'] = /^[0-9]+$/;
				break;
			case 'password':
				res.type = 'password';
				if(res.attrs['required']){
					res.attrs['ng-required'] = 'fCtrl.formMode == "create"';
					delete res.attrs.required;
				}
				break;
			case 'phone':
				res.type = 'text';
				if(!res.attrs['ng-pattern'])
					res.attrs['ng-pattern'] = /^[+#*\(\)\[\]]*([0-9][ ext+-pw#*\(\)\[\]]*){6,45}$/;
				break;
			case 'price':
				res.type = 'text';
				if(!res.attrs['ng-pattern'])
					res.attrs['ng-pattern'] = /^[0-9]+(\.[0-9]{1,2}){0,1}$/;
				break;
			case 'select':
				if(!!element.options){
					// in case options are strings rather than label/value objects.
					element.options = stringOptionsToObjects(element.options);
					res.options = element.options;
				}
				break;
			case 'text':
				res.type = 'text';
				break;
			case 'textarea':
				break;
			case 'time':
				res.type = 'text';
				break;
			case 'typeahead':
				res.type='text';
				if(!!element.options){
					// in case options are strings rather than label/value objects.
					element.options = stringOptionsToObjects(element.options);
					res.options = element.options;
				}
				else
					throw "Autocrud -> Typeahead must have 'options' declared for typeahead.";
				break;
			default:
				throw "Autocrud -> element " + element.name + " has type '" + res.mode + "' not supported.";
		}
		return res;
	}
	_autocrud_prepare_inputs = function(ctrl){
		for(var i in ctrl.tabsElements){
			for(var j in ctrl.tabsElements[i]){
				var el = ctrl.tabsElements[i][j];
				if(!!el.composition){
					for(var k in el.composition){
						el.composition[k].parentEl = el;
						el.composition[k].chars = getCharacteristics(el.composition[k]);
						el.composition[k].chars.html = _autocrud_mount_html(el.composition[k]);
						var maxSize = el.array == true ? 11 : 12;
						if(el.composition[k].size == null || el.composition[k].size == undefined)
							el.composition[k].size = Math.floor(maxSize / el.composition.length);
					}
				} else{
					el.chars = getCharacteristics(el);
					el.chars.html = _autocrud_mount_html(el);
				}
			}
		}
	};
})();