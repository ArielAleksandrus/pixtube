(function(){
var _id = 0;
var app = angular.module('auto-crud', ['auto-crud.directives', 'naif.base64', 'ui.bootstrap',
 'ui.bootstrap.datetimepicker', 'angularUtils.directives.dirPagination']);

var helper = globalUtils.helpers;
// Service to store data and metadata generated
// by the controllers, directives, etc, and to
// be shared among them.
app.service('DataService', function(){
	var serv = {};
	serv.pluginPath = null;
	serv.objStructure = null;
	serv.data = null;
	serv.attrs = null;
	serv.currentItem = {};

	serv.objectProperties = null;
	serv.createUrl = null;
	serv.editUrl = null;

	serv.uniqueIndexOriginalValue = {};
	serv.uniqueIndexErrors = [];

	serv.initFormController = [];
	
	return serv;
});
var defaultPaginateOptions = {
	itemsPerPage: 10
};
var defaultObjectProperties = {
	name: ''
};
function loadData($scope, DataService, ctrl){
	var listHeader = generateListHeader($scope.attrs);
	var objStructure = generateObjStructure($scope.attrs);
	
	DataService.attrs = $scope.attrs;
	DataService.data = $scope.data;
	DataService.objStructure = objStructure;
	$scope.listHeader = listHeader;
	if(!$scope.paginateOptions)
		$scope.paginateOptions = defaultPaginateOptions;
	if(!$scope.objectProperties)
		$scope.objectProperties = defaultObjectProperties;

	DataService.objectProperties = $scope.objectProperties;

	DataService.data = $scope.data;
	if(!!ctrl){
		ctrl.data = DataService.data;
		ctrl.attrs = DataService.attrs;
		ctrl.objStructure = DataService.objStructure;
	}
};
var crudableController = function($scope, DataService){
	var ctrl = this;

	var log = globalUtils.helpers.log;

	ctrl.data = null;
	ctrl.attrs = null;
	ctrl.objStructure = null;
	ctrl.dataService = DataService;

	ctrl.currentItem = DataService.currentItem;

	// Create a copy of the element so the real
	// array's element won't change if there is
	// a cancelled edit operation.
	ctrl.edit = function(element){
		loadData($scope, DataService, ctrl);

		var copy = helper.clone(ctrl.objStructure);
		for(var prop in element)
			copy[prop] = helper.clone(element[prop]);
		ctrl.currentItem = copy;
		DataService.currentItem = copy;
		DataService.initFormController[$scope.autocrudID]('edit');
		ctrl.modalTitle = !!DataService.objectProperties.edits ? "Edição" : "Exibir";
		$("#cruform" + $scope.autocrudID).modal("show");
	};

	// Create a new item with the object's structure
	// for inserting, with all fields nulled, to be
	// appended to the array if insert succeeds.
	ctrl.newItem = function(){
		loadData($scope, DataService, ctrl);
		
		var item = helper.clone(DataService.objStructure);
		ctrl.currentItem = item;
		DataService.currentItem = item;
		DataService.initFormController[$scope.autocrudID]('create');
		ctrl.modalTitle = "Cadastrar";
		$("#cruform" + $scope.autocrudID).modal("show");
	};

	return ctrl;
};

function generateListHeader(attrs){
	var listHeader = [];
	// fills listHeader and objStructure
	for(var i in attrs){
		if(attrs[i].list){
			var compLabel = null;
			if(!!attrs[i].composition){
				for(var j in attrs[i].composition)
					if(attrs[i].composition[j].list != false){
						if(compLabel == null)
							compLabel = [];
						compLabel.push(attrs[i].composition[j].label);
					}
			}
			if(!!compLabel)
				compLabel = helper.joinStrings(" | ", compLabel);

			attrs[i].compositionLabel = compLabel;
			listHeader.push(attrs[i]);
		}
	}
	return listHeader;
}
function generateObjStructure(attrs){
	var objStructure = {};
	for(var i in attrs){
		var value = null;
		if(attrs[i].array == true){
			value = [];
		}
		if(!!attrs[i].composition){
			var aux = {};
			for(var j in attrs[i].composition)
				aux[attrs[i].composition[j].name] = null;

			if(Array.isArray(value))
				value = [aux];
			else
				value = aux;
		}
		objStructure[attrs[i].name] = value;
	}
	return objStructure;
}
// transform date, time and datetime strings in javascript Date object.
function formatDateAndTimeModels(attrs, data){
	var types = ['date', 'time', 'datetime'];
	function format(data, elName){
		for(var i in data){
			if(!!data[i][elName]){
				if(Array.isArray(data[i][elName]) && !!data[i][elName][0] && typeof data[i][elName][0] == 'string'){
					for(var j in data[i][elName])
						data[i][elName][j] = helper.dateToObject(data[i][elName][j]);
					return data;
				} else if(typeof data[i][elName] == 'string'){
					data[i][elName] = helper.dateToObject(data[i][elName]);
					return data;
				}
			} else {
				for(var prop in data[i]){
					if(Array.isArray(data[i][prop]) && !!data[i][prop][0] && typeof data[i][prop][0] == 'object' && !!data[i][prop][0][elName]){
						for(var j in data[i][prop])
							data[i][prop][j][elName] = helper.dateToObject(data[i][prop][j][elName]);
						return data;
					} else if(!!data[i][prop] && typeof data[i][prop] == 'object' && !!data[i][prop][elName]) {
						data[i][prop][elName] = helper.dateToObject(data[i][prop][elName]);
						return data;
					}
				}
			}
		}
		return data;
	}
	for(var i in attrs){
		if(!!attrs[i].description){
			if(types.indexOf(attrs[i].description[0]) > -1)
				data = format(data, attrs[i].name);
		} else {
			for(var j in attrs[i].composition)
				if(types.indexOf(attrs[i].composition[j].description[0]) > -1)
					data = format(data, attrs[i].composition[j].name);
		}
	}
}
// replace the filename string to a base64 object.
function formatFileModels(attrs, data){
	var getBase64FileObject = function(){
		return {
			filetype: null,
			filename: null,
			filesize: null,
			base64: null,
		};
	};
	for(var i in attrs){
		if(!!attrs[i].description){
			if(attrs[i].description[0] == "file"){
				for(var k in data){
					var files = data[k][attrs[i].name];
					var aux;
					var aux = [];
					for(var f in files){
						if(files[f] == null)
							continue;
						var base64Obj = getBase64FileObject();
						base64Obj.filename = files[f];
						aux.push(base64Obj);
					}
					data[k][attrs[i].name] = aux;
				}
			}
		} else {
			for(var j in attrs[i].composition){
				if(attrs[i].composition[j].description[0] == "file"){
					var base64Obj = getBase64FileObject();
					for(var k in data){
						var aux;
						var tuples = data[k][attrs[i].name];
						aux = [];
						for(var t in tuples){
							var base64Obj = getBase64FileObject();
							base64Obj.filename = tuples[t][attrs[i].composition[j].name];
							aux.push(tuples[t]);
							aux[aux.length - 1][attrs[i].composition[j].name] = base64Obj;
							data[k][attrs[i].name][t][attrs[i].composition[j].name] = base64Obj;
						}
						data[k][attrs[i].name] = aux;
					}
				}
			}
		}
	}
}

app.directive('crudable', ['DataService', function(DataService){
	var defaultPaginateOptions = {
		itemsPerPage: 10
	};
	var defaultObjectProperties = {
		name: ''
	};
	function addPasswordConfirmation(attrs){
		function add(parentArr, element){
			var args = '"' + element.name + '", "' + element.confirmation + '", this';
			if(!!element.parentEl && element.parentEl.array == true){
				args += ', $parent.$parent.$parent.$parent.$index';
			} else if(element.array == true) {
				args += ', $index';
			}
			element.description.push('ng-change=fCtrl.checkPasswordConfirmation(' + args + ')');
			var aux = helper.clone(element);
			aux.label = "Confirmação " + aux.label;
			aux.name = element.confirmation;
			delete aux.confirmation;
			parentArr.splice(parentArr.indexOf(element) + 1, 0, aux);
		}
		for(var i in attrs){
			if(!!attrs[i].composition){
				for(var j in attrs[i].composition){
					if(attrs[i].composition[j].description[0] == 'password' && !!attrs[i].composition[j].confirmation)
						add(attrs[i].composition, attrs[i].composition[j]);
				}
			} else {
				if(attrs[i].description[0] == 'password' && !!attrs[i].confirmation)
					add(attrs, attrs[i]);
			}
		}
	};
	return {
		restrict: 'E',
		scope: {
			data: '=',
			attrs: '=',
			paginateOptions: '=',
			objectProperties: '='
		},
		controller: crudableController,
		controllerAs: 'ctrl',
		link: function(scope, element, attrs){
			scope.autocrudID = _id;
			_id++;
			addPasswordConfirmation(scope.attrs);

			scope.getTemplateUrl = function(){
				DataService.pluginPath = attrs.pluginPath;
				return DataService.pluginPath + '/html/crudable.html';
			};

			formatDateAndTimeModels(scope.attrs, scope.data);
			formatFileModels(scope.attrs, scope.data);
			loadData(scope, DataService);
		},
		template: '<div ng-include="getTemplateUrl()"></div>'
	};
}]);

app.directive('customInput', ['$compile', function($compile){
	return{
		restrict: 'E',
		scope: true,
		link: function(scope, element, attrs){
			var el;
			if(!!scope.c)
				el = angular.element(scope.c.chars.html);
			else if(!!scope.e)
				el = angular.element(scope.e.chars.html);
			element.append(el);
			$compile(el)(scope);
		}
	};
}]);
app.directive('autocrudList', ['DataService', function(DataService){
	return{
		restrict: 'E',
		templateUrl: DataService.pluginPath + "/html/listing/default.html"
	}
}]);
// directive that formats the inputs.
app.directive('autocrudListTd', function(){
	return{
		restrict: 'A',
		link: function(scope, element, attrs){
			function handleCompositionObject(obj, attrElement){
				var res = [];
				var value;
				var imageIndex = -1;
				for(var i in attrElement.composition){
					value = obj[attrElement.composition[i].name];
					if(attrElement.composition[i].list != false){
						if(attrElement.composition[i].description[0] == 'file'){
							if(typeof value == "object"){
								value = value.filename;
							}
							if(attrElement.composition[i].description[1] == 'image')
								imageIndex = i;
						}
						else
							res.push(handleAllTypes(attrElement.composition[i], value));
					}
				}
				if(imageIndex > -1){
					var i = imageIndex;
					var html = "<div class='autocrud-listing-image-composition'>";
					html += handleAllTypes(attrElement.composition[i], value);
					html += "<span>" + helper.joinStrings(" | ", res) + "</span>";
					html += "</div>";
					return html;
				} else
					return helper.joinStrings(" | ", res);
			}
			function handleAllTypes(element, value){
				var desc = element.description;
				if(desc == null || desc == undefined || value == null || value == undefined)
					return null;
				if(desc[0] == "date" || desc[0] == "datetime" || desc[0] == "time")
					return helper.dateToShow(value, desc[0]);
				if(desc[0] == "file"){
					if(desc[1] == "image"){
						var path = (!!element.folder ? element.folder + "/" + value : value);
						var html = "<img src='" + path + "' alt='Não disponível' ";
						if(!!element.listSize){
							if(typeof element.listSize == 'object'){
								if(!!element.listSize.height)
									html += "height='" + element.listSize.height + "' ";
								if(!!element.listSize.width)
									html += "width='" + element.listSize.width + "' ";
							} else if(typeof element.listSize == 'string')
								html += "class='autocrud-listing-image-" + element.listSize + "'";
						}
						html += "/>";
						return html;
					}
					return value;
				}
				if(desc[0] == "textarea"){
					var strings = value.split("\n");
					return helper.joinStrings('<br/>', strings);
				}
				if(desc[0] == "typeahead" || desc[0] == "select"){
					for(var i in element.options)
						if(element.options[i].value == value)
							return element.options[i].label;
				}
				return value;
			}

			if(!scope.lh.list)
				return;
			var content = scope.d[scope.lh.name];
			var aux = null;
			if(Array.isArray(content)){
				for(var i in content){
					if(content[i] == null)
						continue;
					if(aux == null)
						aux = [];
					if(typeof content[i] == "object"){
						if(!!scope.lh.description && scope.lh.description[0] == 'file'){
							aux.push(handleAllTypes(scope.lh, content[i].filename));
						}
						else
							aux.push(handleCompositionObject(content[i], scope.lh));
					}
					else
						aux.push(handleAllTypes(scope.lh, content[i]));
				}
				aux = helper.joinStrings('<br/>', aux);
			}
			if(!!aux)
				element.html(aux);
			else
				element.html(handleAllTypes(scope.lh, content));
		}
	};
});
app.directive('autocrudForm', ['DataService', function(DataService){
	return{
		restrict: 'E',
		templateUrl: DataService.pluginPath + "/html/form/form.html"
	}
}]);
app.directive('autocrudFormFooter', ['DataService', function(DataService){
	return{
		restrict: 'E',
		templateUrl: DataService.pluginPath + "/html/form/form_footer.html"
	}
}]);
app.directive('autocrudArrayElement', ['DataService', function(DataService){
	return{
		restrict: 'E',
		replace: true,
		templateUrl: DataService.pluginPath + "/html/form/array_element.html"
	}
}]);
app.directive('autocrudFileElement', ['DataService', function(DataService){
	return{
		restrict: 'E',
		replace: true,
		templateUrl: DataService.pluginPath + "/html/form/file_element.html"
	}
}]);
app.directive('autocrudCompositionElement', ['DataService', function(DataService){
	return{
		restrict: 'E',
		replace: true,
		templateUrl: DataService.pluginPath + "/html/form/composition_element.html"
	}
}]);
})();