(function() {
    'use strict';

    angular
        .module('app')
        .controller('AdminCtrl', AdminCtrl);

    AdminCtrl.$inject = ['$scope',  'Auth', '$modal', 'adminAPI', '$alert', 'vinylsAPI'];

    function AdminCtrl($scope, Auth, $modal, adminAPI, $alert, vinylsAPI) {
        $scope.vinyls = []; // array
        $scope.users = [];
        $scope.user = {}; //object
        $scope.editVinyl = {};
        $scope.deleteBtn = true;

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

        //Get all users and Vinyls

        adminAPI.getAllUsers()
            .then(function(data){
                $scope.users = data.data;
            })
            .catch(function(err){
                console.log('error getting users');
                console.log(err);
            });

        vinylsAPI.getAllVinyls()
            .then(function(data){
                console.log(data);
                $scope.vinyls = data.data;
            })
            .catch(function(err){
                console.log('failed to get all vinyls');
            })

        $scope.deleteUser = function(user){
            adminAPI.deleteUser(user)
                .then(function(data){
                    console.log('user deleted');
                    var index = $scope.users.indexOf(user);
                    $scope.users.splice(index, 1);
                })
                .catch(function(err){
                    console.log('could no delete user' + err)
                })
        }

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

        $scope.deleteVinyl = function(vinyl){
            var index = $scope.vinyls.indexOf(vinyl);

            vinylsAPI.deleteVinyl(vinyl)
                .then(function(data){
                    console.log('success, Vinyl deleted');
                    $scope.vinyls.splice(index, 1);
                })
                .catch(function(err){
                    console.log('failed to delete vinyl' + err);
                });
        }
    }
})();