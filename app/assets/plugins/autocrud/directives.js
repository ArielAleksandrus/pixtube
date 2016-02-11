(function(){
	var app = angular.module('auto-crud.directives', []);
	var helper = globalUtils.helpers;
	app.directive('uniqueIndex', ['$http', 'DataService', function($http, DataService){
		return {
			restrict: 'A',
			require: ['^form', 'ngModel'],
			scope: {
				ngModel: '=',
			},
			link: function(scope, element, attrs, controllers){
				if(attrs.uniqueIndex === '')
					return;

				var form = controllers[0];
				var ngModel = controllers[1];
				var setUniqueIndexValidity = function(value){
					ngModel.$setValidity("unique-index", value);
				};
				var original;
				element.on('focus', function(){
					if(form[element[0].name].$pristine)
						original = ngModel.$viewValue;
				});
				element.on('blur', function(){
					var val = ngModel.$modelValue;
					if(val === undefined || val === null)
						val = element[0].value;
					
					if(val === original || val === ""){
						setUniqueIndexValidity(true);
						scope.$apply();
						return;
					}
					var uniqueUrl = !!DataService.objectProperties.uniqueUrl ? DataService.objectProperties.uniqueUrl : 'unique';
					$http.post('/' + attrs.uniqueIndex + '/' + uniqueUrl,
					{
				    utf8: '✓',
				    authenticity_token: $('meta[name=csrf-token]').attr('content'),
						attrName: attrs.name,
						attrValue: val,
					})
					.then(function(response){
						if(!!response.data.id && parseInt(response.data.id) > 0){
							BootstrapDialog.show({
								title: "Erro!",
								message: "Valor já existe! Favor informar um diferente.",
								type: BootstrapDialog.TYPE_DANGER,
								buttons: [{
									label: 'Fechar',
									cssClass: 'btn-md btn-default',
									action: function(dialog){
										dialog.close();
									}
								}]
							});
							setUniqueIndexValidity(false);
						} else {
							setUniqueIndexValidity(true);
						}
					}, function(response){
						globalUtils.helpers.handleServerError(response);
					});
				});
			}
		}
	}]);

	app.directive('noRepeat', ['DataService', function(DataService){
		return{
			restrict: 'A',
			require: 'ngModel',
			scope: {
				ngModel: '=',
				noRepeat: '=',
			},
			link: function(scope, element, attrs, ngModel){
				scope.$watch('ngModel', function(v){
					var auxScope = scope;
					var name = element[0].name.indexOf("[") > -1 ? element[0].name.slice(0, element[0].name.indexOf("[")) : element[0].name;
					var index = -1;
					var curItem = scope.noRepeat;
					var parent;
					while(auxScope.c == undefined && auxScope.e == undefined){
						if(auxScope.$parent == null || auxScope.$parent == undefined)
							return;
						auxScope = auxScope.$parent;
					}
					if(!!auxScope.c){
						parent = helper.autocrudFindCurrentItemPropertyParent(curItem, auxScope.c);
						index = auxScope.$parent.$parent.$parent.$parent.$index;
					} else if(!!auxScope.e){
						parent = helper.autocrudFindCurrentItemPropertyParent(curItem, auxScope.e);
						if(typeof parent == "object")
							parent = parent[name];
						index = auxScope.$index;
					}
					if(parent == null || parent == undefined || !Array.isArray(parent) || index == -1){
						throw "Autocrud -> no-repeat directive only works with elements of type 'array'";
						return;
					}
					if(scope['noRepeat' + name] == undefined)
						scope['noRepeat' + name] = parent;
					
					var hasError = false;
					for(var i in parent){
						if(i == index)
							continue;
						if(typeof parent[i] == 'object'){
							if(v == parent[i][name]){
								ngModel.$setValidity("norepeat",false);
								hasError = true;
	        		}
	        	} else {
	        		if(v == parent[i]){
								ngModel.$setValidity("norepeat",false);
								hasError = true;
							}
	        	}
					}
					if(!hasError)
						ngModel.$setValidity("norepeat",true);
				});
			}
		};
	}]);
})();