(function() {

	'use strict';

	angular
		.module('app')
		.controller('VinylCtrl', VinylCtrl);

	VinylCtrl.$inject = ['$scope', '$stateParams', 'vinylsAPI', 'commentAPI', 'Auth'];

	function VinylCtrl($scope, $stateParams, vinylsAPI, commentAPI, Auth){
		$scope.user = Auth.getCurrentUser();
		$scope.id = $stateParams.vinylId; // the string connected to a vinyl - grab a hold of the numbered reference
		$scope.popVinyls = [];
		$scope.comments = [];


		vinylsAPI.findOneVinyl($scope.id)
			.then(function(data){
				console.log(data);
				$scope.vinyl = data.data;
				addView();
			})
			.catch(function(err){
				console.log('failed to get Vinyl', err);
			});

		vinylsAPI.popVinyls($scope.id)
			.then(function(data){
				console.log(data);
				$scope.popVinyls = data.data;
			})
			.catch(function(err){
				console.log('failed to get pop vinyl', err);
			});

		commentAPI.getComments($scope.id)
			.then(function(data){
				console.log(data);
				$scope.comments = data.data;
			})
			.catch(function(err){
				console.log('failed to get comments');
			});

		$scope.addVote = function(vinyl){
            vinylsAPI.upVoteVinyl(vinyl)
                .then(function(data){
                    console.log(data);
                    vinyl.upVotes++;
                })
                .catch(function(err){
                    console.log('failed adding upvote');
                });
        }

		$scope.postComment = function(){
			var comment = {
				authorId: $scope.user.id,
				authorName: $scope.user.name,
				authorEmail: $scope.user.email,
				gravatar: $scope.user.gravatar,
				comment: $scope.comment.body,
				vinylId: $scope.id
			}

			commentAPI.addComment(comment)
				.then(function(data){
					console.log(data)
					$scope.comment.body = '';
					$scope.comments.splice(0, 0, data.data);
				})
				.catch(function(err){
					console.log('failed to post comment');
				});
		}

		function addView(){
			vinylsAPI.addView($scope.id)
				.then(function(res){
					console.log('view added to vinyl');
					console.log(res);
				})
				.catch(function(err){
					console.log('failed to increment ' + err);
				});
		}

	}


})();
