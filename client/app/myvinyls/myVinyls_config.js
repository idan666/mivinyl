(function() {

	'use strict';

	angular
		.module('app')
		.config(config);

	config.$inject = ['$stateProvider'];

	function config($stateProvider){
		$stateProvider
			.state('myvinyls', {
				url: '/myvinyls',
				templateUrl: 'app/myvinyls/myVinyls.html',
				controller: 'MyVinylsCtrl',
				// resolve: function ... ;update page
				authenticate: true
			});
	}

})();
