(function() {

	'use strict';

	angular
		.module('app')
		.config(config);

	config.$inject =['$stateProvider'];

	function config($stateProvider){
		$stateProvider
			.state('vinyl', {
				url: '/vinyl/:vinylId',
				templateUrl: 'app/vinyl/vinyl_detail_view.html',
				controller: 'VinylCtrl'
			});
	}

})();
