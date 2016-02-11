(function(){
	var app = angular.module('login', ['ui.bootstrap']);

	app.controller('LoginController', function($http){
		var ctrl = this;

		ctrl.data = {
			utf8: '✓',
			authenticity_token: $('meta[name=csrf-token]').attr('content'),
			commit: 'Log in'
		};

		ctrl.aux = {
			username: '',
			password: '',
			remember_me: false
		};

		ctrl.data[loginSettings.wrapper] = {};

		ctrl.alert = {
			type: null,
			title: null,
			msg: null,
		};

		ctrl.closeAlert = function(){
			if($("#mensagem").is(":visible"))
				$("#mensagem").slideUp("fast");
		};
		var showAlert = function(){
			$("#mensagem").slideDown("fast");
		};

		ctrl.send = function(){
			ctrl.closeAlert();

			for(var prop in ctrl.aux)
				ctrl.data[loginSettings.wrapper][prop] = ctrl.aux[prop];

			$http.post('/login', ctrl.data)
			.success(function(data, status){
				location = "/";
			})
			.error(function(data, status){
				if(status == 401){
					ctrl.alert.type = 'danger';
					ctrl.alert.title = 'Erro';
					ctrl.alert.msg = 'Usuário ou senha incorretos';
				} else {
					ctrl.alert.type = 'danger';
					ctrl.alert.title = 'Erro do servidor';
					ctrl.alert.msg = status;
				}
				showAlert();
			});
		};

		return ctrl;
	});
})();