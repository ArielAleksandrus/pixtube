angular.module('auto-crud').controller('FormController', ['$scope', 'DataService', '$http', function($scope, DataService, $http){
	$scope.isArray = angular.isArray;
	var ctrl = this;
	var helper = globalUtils.helpers;
	$scope.helper = helper;

	ctrl.curItem = null;

	ctrl.formMode = null; // edit or create
	ctrl.attrs = null;
	ctrl.data = null;
	ctrl.tabs = null; // array composed by the tabs's names.
	ctrl.activeTab = null;
	ctrl.tabsElements = null; // inputs related to each tab.
	ctrl.activeTabIndex = null;
	ctrl.objectProperties; // if you can create, edit or delete a record, specifies the attribute to send, the method, and the url.

	// to help the form
	$scope.activeForm = {value: 0};
	ctrl.hasAnyErrorOnForms = function(){
		for(var i in ctrl.tabs)
			if(!!ctrl['form' + i] && ctrl['form' + i].$invalid)
				return true;

		return false;
	};
	ctrl.checkArrayLength = function(element){
		if(element.arrayMinLength == undefined && element.arrayMaxLength == undefined)
			return;
		var formNumber = -1;
		for(var i in ctrl.tabs)
			for(var j in ctrl.tabsElements[ctrl.tabs[i]])
				if(ctrl.tabsElements[ctrl.tabs[i]][j].name == element.name)
					formNumber = i;
		if(formNumber == -1 || ctrl['form' + formNumber] == undefined)
			return;

		if(!!element.arrayMinLength){
			if(ctrl.curItem[element.name].length < element.arrayMinLength)
				ctrl['form' + formNumber].$setValidity(element.name + 'MinLength', false);
			else
				ctrl['form' + formNumber].$setValidity(element.name + 'MinLength', true);
		}

		if(!!element.arrayMaxLength){
			if(ctrl.curItem[element.name].length > element.arrayMaxLength)
				ctrl['form' + formNumber].$setValidity(element.name + 'MaxLength', false);
			else
				ctrl['form' + formNumber].$setValidity(element.name + 'MaxLength', true);
		}
	};

	ctrl.hasError = function(formIndex, elementName){
		var check = function(frmIdx, elName){
			if(!!ctrl['form' + frmIdx][elName])
				if(ctrl['form' + frmIdx][elName].$invalid)
					return true;

			return false;
		};
		if(Array.isArray(elementName)){ // is a parent of a composed input.
			var res = false;
			for(var i in elementName)
				res |= check(formIndex, elementName[i].name);
			return res;
		} else 
			return check(formIndex, elementName);
	};

	// to help datepicker.
	$scope.openedDP = {};
	$scope.toggleDatePicker = function($event, elemName, index){
		$event.preventDefault();
		$event.stopPropagation();
		$scope.openedDP["data_expiracao"] = true;
	};
	$scope.now = new Date();

	ctrl.clearForm = function(){
		var i = 0;
		while(!!ctrl['form' + i]){
			ctrl['form' + i].$setPristine();
			ctrl['form' + i].$setUntouched();
			var aux = {};
			for(var err in ctrl['form' + i].$error){
				if(err != 'unique-index')
					aux[err] = ctrl['form' + i].$error[err];
			}
			ctrl['form' + i].$error = aux;
			i++;
		}
		var fileElements = helper.autocrudFindAttrByChars($scope.attrs, {type: 'file'});
		for(var i in fileElements)
			fileElements[i].auxModel = null;

		$scope.openedDP = {};
	};

	// password confirmation.
	ctrl.checkPasswordConfirmation = function(passName, confPassName, htmlEl){
		function setError(value){
			if(!!ctrl['form' + ctrl.activeTabIndex][confPassName])
				ctrl['form' + ctrl.activeTabIndex][confPassName].$setValidity('autocrudNoMatch', !value);
		}
		var passValue = ctrl.curItem[passName];
		var confPassValue = ctrl.curItem[confPassName];

		var passEmpty = false;
		var confPassEmpty = false;
		if(passValue == '' || passValue == null || passValue == undefined)
			passEmpty = true;
		if(confPassValue == '' || confPassValue == null || confPassValue == undefined)
			confPassEmpty = true;

		if(passEmpty && confPassEmpty)
			setError(false);
		else if(passValue != confPassValue){
			setError(true);
		} else {
			setError(false);
		}
	};

	ctrl.removeArrayElement = function(element, tuple, $index){
		function removeAuxModel(element, $index){
			if(!!element.auxModel)
				element.auxModel.splice($index, 1);
		}

		var fileElement;
		if(!!element.composition){
			for(var i in element.composition)
				if(element.composition[i].chars.type == 'file')
					removeAuxModel(element.composition[i], $index);
		} else {
			removeAuxModel(element, $index);
		}
		
		ctrl.curItem[element.name].splice(ctrl.curItem[element.name].indexOf(tuple), 1);

		ctrl.checkArrayLength(element);
	};
	ctrl.addArrayElement = function(element){
		var newItem = null;
		if(!!element.composition){
			newItem = {};
			for(var i in element.composition){
				newItem[element.composition[i].name] = null;
			}
		}
		if(Array.isArray(ctrl.curItem[element.name]))
			ctrl.curItem[element.name].push(newItem);
		else
			ctrl.curItem[element.name] = [newItem];

		ctrl.checkArrayLength(element);
	};
	ctrl.setActiveTab = function(tab){
		if(ctrl.activeTab === tab)
			return;
		ctrl.activeTabIndex = ctrl.tabs.indexOf(tab);
		ctrl.activeTab = tab;
	};

	var getFormattedData = function(){
		var auxToSend = {};
		for(var tab in ctrl.attrs){
			for(var i in ctrl.attrs[tab]){
				element = ctrl.attrs[tab][i];
				var inserted = false;
				if(element.mode !== 'file'){
					try{
						if(element.mode === "date" || element.mode === "datetime"){
							ctrl.curItem[element.name] = helper.dateToShow(element.model, element.mode);
							auxToSend[element.name] = helper.dateToSQL(element.model, element.mode);
							inserted = true;
						} else if(element.mode === "textarea"){
							ctrl.curItem[element.name] = element.model;
							auxToSend[element.name] = helper.textareaToSQL(element.model);
							inserted = true;
						}
					} catch(e){
						
					}
				}
				if(!inserted){
					ctrl.curItem[element.name] = element.model;
					if(element.mode !== 'file')
						auxToSend[element.name] = element.model;
				}
			}
		}
		return auxToSend;
	};
	var prepareToSend = function(toSend){
		// change textarea line breaks to '\\n' characters.
	  var els = helper.autocrudFindAttrByChars($scope.attrs, {mode: 'textarea'});
	  for(var i in els){
	  	var parent = helper.autocrudFindCurrentItemPropertyParent(toSend, els[i]);
	  	if(Array.isArray(parent)){
	  		for(var j in parent){
	  			if(!!parent[j][els[i].name])
	  				parent[j][els[i].name] = parent[j][els[i].name].replace(/\n/g, '\\n');
	  		}
	  	} else if(typeof parent == "object"){
	  		if(!!parent[els[i].name]){
	  			parent[els[i].name] = parent[els[i].name].replace(/\n/g, '\\n');
	  		}
	  	}
	  }
	  //////////////////////////////////

	  // remove files that have no base64 attribute.
	  els = helper.autocrudFindAttrByChars($scope.attrs, {type: 'file'});
	  for(var i in els){
	  	var par = helper.autocrudFindCurrentItemPropertyParent(toSend, els[i]);
	  	var models = helper.clone(els[i].auxModel);
	  	// convert auxModel's objects to string.
	  	if(Array.isArray(models)){
	  		for(var j in models){
	  			if(Array.isArray(models[j])){
	  				for(var k in models[j]){
	  					models[j][k] = (!!models[j][k] ? models[j][k].base64 : null);
	  				}
	  			} else {
	  				models[j] = (!!models[j] ? models[j].base64 : null);
	  			}
	  		}
	  	} else {
	  		if(!!models)
	  			models = models.base64;
	  	}
	  	// move 'models' to toSend json object.
	  	// handles Array of composition and Array of composition with files with 'multiple' attr.
	  	if(Array.isArray(par) && !!par[0] && !!par[0][els[i].name]){
	  		for(var j in par){
	  			par[j][els[i].name] = (!!models[j] ? models[j] : null);
	  		}
	  		// handles array, 'multiple' attr, array with 'multiple' attr, composition, composition with 'multiple' attr and normal.
	  	} else {
	  		par[els[i].name] = models;
	  	}
		}
	  //////////////////////////////////

	  // convert date object to string
	  var aux1 = helper.autocrudFindAttrByChars($scope.attrs, {mode: 'date'});
	  var aux2 = helper.autocrudFindAttrByChars($scope.attrs, {mode: 'datetime'});
	  var aux3 = helper.autocrudFindAttrByChars($scope.attrs, {mode: 'time'});
	  var els = [];
	  for(var i in aux1)
	  	els.push(aux1[i]);
	  for(var i in aux2)
	  	els.push(aux2[i]);
	  for(var i in aux3)
	  	els.push(aux3[i]);
	  for(var i in els){
	  	var parent = helper.autocrudFindCurrentItemPropertyParent(toSend, els[i]);
	  	if(Array.isArray(parent)){
	  		for(var j in parent){
	  			if(!!parent[j][els[i].name])
	  				parent[j][els[i].name] = helper.dateToSQL(parent[j][els[i].name], els[i].chars.mode);
	  		}
	  	} else if(typeof parent == "object"){
	  		if(!!parent[els[i].name]){
	  			parent[els[i].name] = helper.dateToSQL(parent[els[i].name], els[i].chars.mode);
	  		}
	  	}
	  }
	  return toSend;
	}
	ctrl.send = function(){
		// PREPARE TO SEND TO SERVER
	  var url = window.location.origin + '/' + DataService.objectProperties.baseUrl;
	  var toSend;
	  // creates, edits, deletes
	  var urlToSend = DataService.objectProperties[ctrl.formMode + 's'].url;
	  // for inserting an object attribute in url.
	  var indexColem = urlToSend.indexOf(':');
	  if(indexColem > -1){
	  	var indexSlash = urlToSend.indexOf('/', indexColem);
	  	if(indexSlash == -1)
	  		indexSlash = undefined;
	  	var substrToReplace = urlToSend.slice(indexColem, indexSlash);
	  	urlToSend = urlToSend.replace(substrToReplace, ctrl.curItem[substrToReplace.slice(1)]);
	  }
	  var method = DataService.objectProperties[ctrl.formMode + 's'].method;
	  var add_to_sending = DataService.objectProperties[ctrl.formMode + 's'].also;

	  if(ctrl.formMode == 'create' || ctrl.formMode == 'edit'){
	  	toSend = prepareToSend(helper.clone(ctrl.curItem));
	  	// fields that have an empty value (empty string or null) shall be overriden as undefined
	  	toSend = helper.emptyToValue(toSend, undefined);
	  } else if(ctrl.formMode == 'delete'){
	  	toSend = new FormData();
	  }


	  // if there is anything else you want to send...
	  if(!!add_to_sending)
	  	for(var prop in add_to_sending)
	  		ctrl.formMode == 'delete' ? toSend.append(prop, add_to_sending[prop]) : toSend[prop] = add_to_sending[prop];

	  urlToSend = DataService.objectProperties.baseUrl + (!!urlToSend ? '/' + urlToSend : '');

	  method = !!method ? method : 'post';
	  method.toUpperCase();

		$http({
			method: method,
			url: urlToSend,
			data: toSend
		}).then(function(response){
			if((!!response.data.status || !!response.data.id) && (response.data.status == 'success' || response.data.id > 0)){;
	    	
				helper.handleServerSuccess(response);
	    	ctrl.closeModal();
				helper.dialogAlert('Operação realizada com sucesso', 'Sucesso', 'primary', {
					onhidden: function(){
						location.reload();
					}
				});
			} else {
				helper.dialogAlert('Erro na operação', 'Erro', 'danger');
			}
		}, function(response){
			helper.handleServerError(response);
			helper.dialogAlert('Erro do servidor! Ref.: ' + response.statusText, 'Erro', 'danger');
		});
			
	};
	
	ctrl.closeModal = function(){
		$("#cruform" + $scope.autocrudID).modal("hide");
	};

	$scope.formatLabel = function(model, element){
		for(var i = 0; i < element.options.length; i++){
			if(model == element.options[i].value)
				return element.options[i].label;
		}
	};
	var init = function(mode){
		ctrl.attrs = DataService.attrs;
		ctrl.curItem = DataService.currentItem;
		ctrl.data = DataService.data;
		ctrl.formMode = mode;
		ctrl.objectProperties = DataService.objectProperties;
		hasTabs();
		ctrl.activeTab = ctrl.tabs[0];
		ctrl.activeTabIndex = 0;

		var attrs = ctrl.attrs;
		for(var i in attrs){
			if(!!attrs[i].description){
				if(attrs[i].description.indexOf('date') > -1 || attrs[i].description.indexOf('datetime') > -1)
					if(attrs[i].array){
						if(!!$scope.openedDP[attrs[i].name])
							$scope.openedDP[attrs[i].name].push(false);
						else
							$scope.openedDP[attrs[i].name] = [false];
					} else {
						$scope.openedDP[attrs[i].name] = false;
					}
			} else if(!!attrs[i].composition){
				for(var j in attrs[i].composition)
					if(attrs[i].composition[j].description.indexOf('date') > -1 || attrs[i].composition[j].description.indexOf('datetime') > -1)
						if(attrs[i].array){
							if(!!$scope.openedDP[attrs[i].composition[j].name])
								$scope.openedDP[attrs[i].composition[j].name].push(false);
							else
								$scope.openedDP[attrs[i].composition[j].name] = [false];
						} else{
							$scope.openedDP[attrs[i].composition[j].name] = false;
						}
			}
		}

		ctrl.clearForm();

		_autocrud_prepare_inputs(ctrl);
		for(var i in attrs){
			if(attrs[i].array == true)
				ctrl.checkArrayLength(attrs[i]);
		}
	};
	// Process all data related to tabs:
	// tabs, activeTab, tabsElements
	var hasTabs = function(){
		var attrs = ctrl.attrs;
		
		ctrl.tabs = [];
		ctrl.tabsElements = {};
		var has = false;
		for(var i in attrs){
			if(attrs[i].onForm != false){
				// if attrs[i].tab is not defined, add it to a default tab.
				if(attrs[i].tab == null || attrs[i].tab == undefined)
					attrs[i].tab = 'Outros';
				// fills tabs array.
				if(ctrl.tabs.indexOf(attrs[i].tab) === -1){
					ctrl.tabs.push(attrs[i].tab);
					has = true;
				}
				// fills tabsElements object.
				if(ctrl.tabsElements.hasOwnProperty(attrs[i].tab))
					ctrl.tabsElements[attrs[i].tab].push(attrs[i]);
				else
					ctrl.tabsElements[attrs[i].tab] = [attrs[i]];
			}
		}
		return has;
	};
	
	DataService.initFormController.push(init);
	return ctrl;
}]);