var globalUtils = globalUtils || {};

globalUtils.helpers = {
	autocrudAdjustDataArray: function(attrs, data){
		function getAdjustedValue(type, value){
			switch(type){
				case 'id':
				case 'int':
				case 'float':
				case 'number':
					return Number(value);
				case 'checkbox':
					return type == "true" || type == true;
				default:
					return value;
			}
		}
		for(var i in attrs){
			// is not composition
			if(!!attrs[i].description){
				if(Array.isArray(data)){
					for(var j in data){
						if(typeof data[j] == 'object')
							data[j][attrs[i].name] = getAdjustedValue(attrs[i].description[0], data[j][attrs[i].name]);
						else
							data[j] = getAdjustedValue(attrs[i].description[0], data[j]);
					}
				} else if(typeof data == 'object') {
					data[attrs[i].name] = getAdjustedValue(attrs[i].description[0], data[attrs[i].name]);
				}
				// is composition
			} else {
				if(Array.isArray(data))
					for(var j in data)
						data[j][attrs[i].name] = globalUtils.helpers.autocrudAdjustDataArray(attrs[i].composition, data[j][attrs[i].name]);
				else
					data[attrs[i].name] = globalUtils.helpers.autocrudAdjustDataArray(attrs[i].composition, data[attrs[i].name]);
			}
		}
		return data;
	},
	appendToURL: function(toAppend){
		var currentUrl = window.location.href;
		var lastChar = currentUrl.charAt(currentUrl.length - 1);
		if(toAppend.charAt(0) != '/')
			toAppend = '/' + toAppend;

		if(lastChar == '/' || lastChar == '#')
			return currentUrl.slice(0, currentUrl.length - 1) + toAppend;
		else if(currentUrl.indexOf('?') > -1)
			return currentUrl.slice(0, currentUrl.indexOf('?')) + toAppend;
		else
			return currentUrl + toAppend;
	},
	// selector is of format: {<name of the selector>: <value>}
	autocrudFindAttr: function(attrs, selector){
		var sName = Object.keys(selector)[0]; // get the first (and only) property.
		var sValue = selector[sName];

		var res = [];

		for(var i in attrs){
			if(!!attrs[i].composition){
				var subRes = globalUtils.helpers.autocrudFindAttr(attrs[i].composition, selector);
				res.concat(subRes);
			} else {
				if(attrs[i][sName] == sValue || (sName == 'description' && attrs[i][sName].indexOf(sValue) > -1))
					res.push(attrs[i]);
			}
		}
		return res;
	},
	autocrudFindAttrByChars: function(attrs, charsSelector){
		var sName = Object.keys(charsSelector)[0]; // get the first (and only) property.
		var sValue = charsSelector[sName];
		var res = [];
		for(var i in attrs){
			if(!!attrs[i].composition){
				var subRes = globalUtils.helpers.autocrudFindAttrByChars(attrs[i].composition, charsSelector);
				for(var i in subRes)
					res.push(subRes[i]);
			} else if(!!attrs[i].chars){
				if(attrs[i].chars[sName] == sValue)
					res.push(attrs[i]);
			}
		}
		return res;
	},
	// selector is of format: {<name of the selector>: <value>}
	autocrudFindAttrParent: function(attrs, selector){
		var sName = Object.keys(selector)[0]; // get the first (and only) property.
		var sValue = selector[sName];
		var res = [];
		for(var i in attrs)
			if(!!attrs[i].composition){
				var subRes = globalUtils.helpers.autocrudFindAttrParent(attrs[i].composition, selector);
				if(subRes.length > 0)
					res.concat(subRes);
			} else {
				if(attrs[i][sName] == sValue)
					res.push(attrs[i]);
			}

		return res;
	},
	// can return an object or an array of primitive types or an array of objects.
	autocrudFindCurrentItemPropertyParent: function(curItem, element){
		if(!!element.parentEl)
			return curItem[element.parentEl.name];
		else
			return curItem;
	},
	clone: function(obj){
		var copy;

	    // Handle the 3 simple types, and null or undefined
	    if (null == obj || "object" != typeof obj) return obj;

	    // Handle Date
	    if (obj instanceof Date) {
	        copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	    }

	    // Handle Array
	    if (obj instanceof Array) {
	        copy = [];
	        for (var i = 0, len = obj.length; i < len; i++) {
	            copy[i] = globalUtils.helpers.clone(obj[i]);
	        }
	        return copy;
	    }

	    // Handle Object
	    if (obj instanceof Object) {
	        copy = {};
	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) copy[attr] = globalUtils.helpers.clone(obj[attr]);
	        }
	        return copy;
	    }

	    throw new Error("Unable to copy object! Its type isn't supported.");
	},
	containsOR: function(arr, needles){
		for(var i in arr)
			for(var j in needles)
				if(arr[i] === needles[j])
					return true;
	},
	dateToObject: function(date){
		if(date instanceof Date && !isNaN(date.valueOf()))
			return date;
		if(typeof date !== 'string')
			return;
		if(!globalUtils.helpers.isDateFormat(date)){
			console.log('Autocrud -> not a valid date ISO date. Have you removed the timestamp? ', date);
			return;
		}
		try{
			var sqlDate = globalUtils.helpers.dateToSQL(date);
			if(sqlDate.indexOf(" ") > -1)
				sqlDate.replace(" ", "T");
			var offset = new Date(sqlDate).getTimezoneOffset();
			return new Date((new Date(sqlDate)).getTime() + offset * 60 * 1000);
		} catch(e){
			console.log(e);
			return;
		}
	},
	// receives a YYYY MM DD HH mm ss date (separators could be / - . for date and : for time)
	// returns a DD/MM/YYYY HH:mm:ss string
	dateToShow: function(date, mode){
		if(mode == undefined)
			var mode = "datetime";

		if(typeof date == 'string' && date.indexOf('GMT') > -1)
			date = new Date(date);
		if(date instanceof Date){
			function zeroToTheLeft(val){
				return val < 10 ? "0" + val.toString() : val.toString();
			}
			var month = zeroToTheLeft(date.getMonth()+1);
			var day = zeroToTheLeft(date.getDate());
			var hours = zeroToTheLeft(date.getHours());
			var minutes = zeroToTheLeft(date.getMinutes());
			var seconds = zeroToTheLeft(date.getSeconds());

			var dayMonthYear = day + "/" + month + "/" + date.getFullYear().toString();
			var hourMinSec = hours + ":" + minutes + ":" + seconds;
			var res = "";
			if(mode.indexOf('date') > -1)
				res += dayMonthYear;
			if(mode.indexOf('time') > -1){
				if(res.length > 0)
					res += " ";
				res += hourMinSec;
			}
			return res;
		}
		try{
			var yearMonthRest = date.split(/[\/|\-|\.]+/);
			var dayHour = yearMonthRest[2].split(" ");
			var res = dayHour[0] + '/' + yearMonthRest[1] + '/' + yearMonthRest[0];
			if(!!dayHour[1] && mode !== 'date')
				res += " " + dayHour[1];
			return res;
		} catch (e) {
			return date;
		}
	},
	dateToSQL: function(date, mode){
		if(mode == undefined)
			var mode = "datetime";

		if(typeof date == 'string')
			date = new Date(date);
		if(date instanceof Date){
			function zeroToTheLeft(val){
				return val < 10 ? "0" + val.toString() : val.toString();
			}
			var month = zeroToTheLeft(date.getMonth()+1);
			var day = zeroToTheLeft(date.getDate());
			var hours = zeroToTheLeft(date.getHours());
			var minutes = zeroToTheLeft(date.getMinutes());
			var seconds = zeroToTheLeft(date.getSeconds());

			var dayMonthYear = date.getFullYear().toString() + "-" + month + "-" + day;
			var hourMinSec = hours + ":" + minutes + ":" + seconds;
			var res = "";
			if(mode.indexOf('date') > -1)
				res += dayMonthYear;
			if(mode.indexOf('time') > -1){
				if(res.length > 0)
					res += " ";
				res += hourMinSec;
			}
			return res;
		}
		try{
			var dayMonth = date.split(/[\/|\-|\.]+/);
			var yearHour = dayMonth[2].split(" ");
			var res = yearHour[0] + '-' + dayMonth[1] + '-' + dayMonth[0];
			if(!!yearHour[1] && mode !== 'date')
				res += " " + yearHour[1];
			return res;
		} catch (e) {
			return date;
		}
	},
	declareAngularModule: function(appName, appDependencies){
		var app;
		try{
			app = angular.module(appName);
		} catch(e){
			if(e.toString().indexOf('nomod'))
				app = angular.module(appName, appDependencies);
			else
				app = null;
		}
		return app;
	},
	dialogAlert: function(mensagem, titulo, type, options){
		if(!!type)
			var t = type.toUpperCase();
		else
			t = "PRIMARY"
		var dialog = {
			type: BootstrapDialog["TYPE_" + t],
			title: titulo,
      message: mensagem,
      buttons: [{
          label: 'Fechar',
          action: function(dialogItself){
              dialogItself.close();
          }
      }]
	  };
		for(var prop in options)
			dialog[prop] = options[prop];

		BootstrapDialog.show(dialog);
	},
	elementIsArray: function(description){
		for(var i in description)
			if(description[i] == 'array')
				return true;

		return false;
	},
	emptyToNull: function(json){
		for(var prop in json)
			if(json[prop] === '' || (Array.isArray(json[prop]) && json[prop].length === 0))
				json[prop] = null;
	},
	emptyToValue: function(thing, value){
		var throughArray = function(obj){
			for(var prop in obj){
				if(obj[prop] == '' || obj[prop] == null){
					obj[prop] = value;
				} else if(typeof obj[prop] == 'object' || Array.isArray(obj[prop])){
					throughArray(obj[prop]);
				}
			}
		};
		if(typeof thing == 'object' || Array.isArray(thing))
			throughArray(thing);
		else if (thing == '' || thing == null)
			thing = value;
		return thing;
	},
	getAppScope: function(appName){
		var appElement = document.querySelector('[ng-app=' + appName + ']');
		var $scope = angular.element(appElement).scope();
		return $scope = $scope.$$childHead;
	},
	getCurrentScriptPath: function(){
		var scripts = document.getElementsByTagName("script");
		var currentScriptPath = scripts[scripts.length - 1].src;
		return currentScriptPath.slice(0, currentScriptPath.lastIndexOf('/') + 1);
	},
	getElementComposition: function(description){
		var isComposed = false;
		var objDesc = null;
		for(var i in description){
			if(typeof description[i] == 'object')
				objDesc = description[i];
			if(description[i] == 'composed')
				isComposed = true;
		}
		if(isComposed)
			return objDesc.inputs;
		else
			return null;
	},
	getElementObject: function(array, name){
		var searchInObject = function(obj, name){
			var found = null;
			if(obj.name == name)
				return obj;
			else
				for(var prop in obj){
					if(!!obj[prop] && typeof obj[prop] == 'object'){
						found = searchInObject(obj[prop], name);
					}
					else if(Array.isArray(obj[prop]))
						found = searchInArray(obj[prop], name);

					if(found != null)
						return found;
				}

			return null;
		};
		var searchInArray = function(arr, name){
			var found = null;
			for(var i in arr){
				if(typeof arr[i] == 'object')
					found = searchInObject(arr[i], name);
				else if(Array.isArray(arr[i]))
					found = searchInArray(arr[i], name);

				if(found != null)
					return found;
			}
			return null;
		};

		var res = null;
		if(Array.isArray(array)){
			res = searchInArray(array, name);
		} else if(typeof array == 'object'){
			res = searchInObject(array, name);
		}
		return res;
	},
	getObjectWithKey: function(obj, key){

		var lookInArray = function(arr, key){
			if(!Array.isArray(arr))
				return null;
			for(var i in arr){
				var found = globalUtils.helpers.getKeyFromObject(arr[i], key);
				if(found != null)
					return found;
			}
			return null;
		};

		if(typeof obj != 'object')
			return null;

		for(var prop in obj){
			if(prop == key){
				return obj;
			}

			if(Array.isArray(obj[prop])){
				var found = lookInArray(obj[prop], key);
				if(found != null)
					return found;
			} else if(typeof obj[prop] == 'object') {
				return globalUtils.helpers.getKeyFromObject(obj[prop], key);
			}
		}
	},
	handleServerError: function(response){
		globalUtils.helpers.log(response);
	},
	handleServerSuccess: function(response){
		globalUtils.helpers.log(response);
	},
	isDate: function(value){
		return (!!globalUtils.helpers.dateToObject(value));
	},
	isDateFormat: function(value){
		if(typeof value != "string")
			return false;
		var dMaHms = /^[0-3]{0,1}[0-9](\/|-|\.)[0-1]{0,1}[0-9](\/|-|\.){0,1}([0-9]{2}){0,2}(\s([0-2][0-9]\:[0-6][0-9](\:[0-6][0-9]){0,1})){0,1}$/;
		var mDaHms = /^[0-1]{0,1}[0-9](\/|-|\.){0,1}[0-3]{0,1}[0-9](\/|-|\.)([0-9]{2}){0,2}(\s([0-2][0-9]\:[0-6][0-9](\:[0-6][0-9]){0,1})){0,1}$/;
		var aMdHms = /^[0-9]{4}(\/|\-|\.)(0|1)[0-9](\/|\-|\.)[0-9]{2}(\s([0-2][0-9]\:[0-6][0-9](\:[0-6][0-9]){0,1})){0,1}$/;
		return (dMaHms.test(value) || mDaHms.test(value) || aMdHms.test(value));
	},
	joinStrings: function(separator, strings, prefixes){
		// base case: the input is a string rather than an array of strings.
		if(typeof strings == 'string'){
			if(typeof prefixes == 'string')
				return prefixes + strings;
			else
				return strings;
		}
		var str = "";
		if(prefixes == undefined)
			prefixes = [];
		for(var i in strings){
			if(typeof strings[i] == "boolean" || typeof strings[i] == "number")
				strings[i] = strings[i].toString();
			if(!!strings[i] && strings[i].length > 0){
				if(!!prefixes[i] && prefixes[i].length > 0)
					str += prefixes[i];
				str += strings[i] + (i != strings.length - 1 ? separator : "");
			} else {
				str = i == strings.length - 1 ?  str.substr(0, str.lastIndexOf(separator)) : str;
			}
		}
		return str;
	},
	log: function(){
		for(var i in arguments)
			console.log(arguments[i]);
	},
	textareaToSQL: function(str){
		if(typeof str !== "string")
			return;

		return str.replace(/(\n)/g, '\\n');
	}
};