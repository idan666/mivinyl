(function() {

	'use strict';

	angular
		.module('app')
		.controller('MyVinylsCtrl', MyVinylsCtrl);

	MyVinylsCtrl.$inject = ['$scope', '$modal', '$state', '$alert', 'vinylsAPI', 'Auth'];

	function MyVinylsCtrl($scope, $modal, $state, $alert, vinylsAPI, Auth){
		//Query on GetUserVinyls - using resp.query.email - via route
		$scope.user = Auth.getCurrentUser();
		var userEmail = $scope.user.email;

		//Creating Scope variables
		$scope.userVinyls = []; // list of vinyls
		$scope.editVinyls = {};

		var alertSuccess = $alert({
			title: 'Saved',
			content: 'Vinyl has been edited',
			placement: 'top-right',
			container: '#alertContainer',
			type: 'success',
			duration: 8
		});

		var alertFail = $alert({
			title: 'Not Saved',
			content: 'Vinyl has failed to edit',
			placement: 'top-right',
			container: '#alertContainer',
			type: 'warning',
			duration: 8
		});

		var myModal = $modal({
			scope: $scope,
			show: false
		});

		$scope.showModal = function(){
			myModal.$promise.then(myModal.show);
		}

		$scope.noVinyls = function(){
			$scope.userVinyls.length === 0
		}

		vinylsAPI.getUserVinyls(userEmail)
			.then(function(data){
				console.log(data);
				$scope.userVinyls = data.data;
			})
			.catch(function(err){
				console.log('failed to get looks for user' + err);
			});

		$scope.editVinyl = function(vinyl){
			vinylsAPI.getUpdateVinyl(vinyl)
				.then(function(data){
					console.log(data);
					$scope.editVinyl = data.data;
				})
				.catch(function(err){
					console.log('failed to edit Vinyl' + err);
				});
		}

		$scope.saveVinyl = function(){
			var vinyl = $scope.editVinyl;

			vinylsAPI.updateVinyl(vinyl)
				.then(function(data){
					console.log('Vinyl Updated');
					console.log(data);
					$scope.editVinyl.title = '';
					$scope.editVinyl.description = '';
					alertSuccess.show();
				})
				.catch(function(err){
					console.log('failed to update' + err);
					alertFail.show();
				})
				.finally(function(){
					$scope.getUserVinyls();
					$state.go('myvinyls');
				});
		}	

		$scope.delete = function(vinyl){
			var index = $scope.userVinyls.indexOf(vinyl);

			vinylsAPI.deleteVinyl(vinyl)
				.then(function(data){
					console.log('success, Vinyl deleted');
					$scope.userVinyls.splice(index, 1);
				})
				.catch(function(err){
					console.log('failed to delete vinyl' + err);
				});
		}

	}

})();
