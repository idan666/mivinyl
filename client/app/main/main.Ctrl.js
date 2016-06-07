(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$scope', '$state', 'Auth', '$modal', 'vinylsAPI', 'scrapeAPI', '$alert', 'Upload'];

    function MainCtrl($scope, $state, Auth, $modal, vinylsAPI, scrapeAPI, $alert, Upload) {
        $scope.user = Auth.getCurrentUser();

        $scope.vinyl = {};
        $scope.vinyls = [];
        $scope.scrapePostForm = true;
        $scope.showScrapeDetails = false;
        $scope.gotScrapeResults = false;
        $scope.loading = false;

        $scope.picPreview = true;
        $scope.uploadVinylTitle = true;
        $scope.uploadVinylForm = false;

        $scope.busy = true;
        $scope.allData = [];
        var page = 0;
        var step = 4;

        var alertSuccess = $alert({
            title: 'Success! ',
            content: 'New Vinyl added',
            placement: 'top-right',
            container: '#alertContainer',
            type: 'success',
            duration: 8
        });

        var alertFail = $alert({
            title: 'Not saved ',
            content: 'New Look failed to save',
            placement: 'top-right',
            container: '#alertContainer',
            type: 'warning',
            duration: 8
        });

        var myModal = $modal({
            scope: $scope,
            show: false
        });

        $scope.showModal = function() {
            myModal.$promise.then(myModal.show);
        }

        $scope.showUploadForm = function(){
            $scope.uploadVinylForm = true;
            $scope.scrapePostForm = false;
            $scope.uploadVinylTitle = false;
        }

        vinylsAPI.getAllVinyls()
            .then(function(data){
                console.log(data);
                // $scope.vinyls = data.data; change for infinite scroll
                $scope.allData = data.data;
                $scope.nextPage();
                $scope.busy = false;

            })
            .catch(function(err){
                console.log('failed to get vinyls' + err);
            });

        $scope.nextPage = function(){
            var vinylLength = $scope.vinyls.length;
            if($scope.busy){
                return;
            }

            $scope.busy = true;
            //Adding vinyls to page
            $scope.vinyls = $scope.vinyls.concat($scope.allData.splice(page * step, step));
            page++;
            $scope.busy = false;

            if($scope.vinyls.length === 0){
                $scope.noMoreData = true;
            }
        }

        //Watch for changes to URL, scrape and desiplay results

        $scope.$watch('vinyl.link', function(newVal, oldVal) {
            if (newVal.length > 5) {
                $scope.loading = true;

                var link = {
                    url: $scope.vinyl.link
                }

                scrapeAPI.getScrapeDetails(link)
                    .then(function(data) {
                        console.log(data);
                        $scope.showScrapeDetails = true;
                        $scope.gotScrapeResults = true;
                        $scope.uploadVinylTitle = false;
                        $scope.vinyl.imgThumb = data.data.img;
                        $scope.vinyl.description = data.data.desc
                    })
                    .catch(function(data) {
                        console.log('failed to return from scrape');
                        $scope.loading = false;
                        $scope.vinyl.link = '';
                        $scope.gotScrapeResults = false;
                    })
                    .finally(function() {
                        $scope.loading = false;
                        $scope.uploadVinylForm = false;
                    })
            }
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

        // POST THE SCRAPED IMAGE TO DATABASE

        $scope.addScrapePost = function() {
            var vinyl = {
                description: $scope.vinyl.description,
                title: $scope.vinyl.title,
                image: $scope.vinyl.imgThumb,
                linkURL: $scope.vinyl.link,
                email: $scope.user.email,
                name: $scope.user.name,
                _creator: $scope.user._id
            }

            vinylsAPI.createScrapeVinyl(vinyl)
                .then(function(data) {
                    alertSuccess.show();
                    $scope.showScrapeDetails = false;
                    $scope.gotScrapeResults = false;
                    $scope.vinyl.title = '';
                    $scope.vinyl.link = '';
                    $scope.vinyls.splice(0, 0, data.data);
                    console.log(data);
                })
                .catch(function() {
                    alertFail.show();
                    console.log('failed to upload to server');
                    $scope.showScrapeDetails = false;
                });
        }
        
        $scope.getAllBuckets = function(){
            
        }
        
        $scope.uploadPic = function(file){
            Upload.upload({
                url: 'api/vinyl/upload',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: {
                    file: file,
                    title: $scope.vinyl.title,
                    description: $scope.vinyl.description,
                    email: $scope.user.email,
                    name: $scope.user.name,
                    linkURL: $scope.vinyl._id,
                    _creator: $scope.user._id
                }
            }).then(function(resp){ // ON SUCCESS 
                console.log('successful upload');
                $scope.vinyls.splice(0,0, resp.data);// push item into view
                $scope.vinyl.title = '';
                $scope.vinyl.description = '';
                $scope.picFile = '';
                $scope.picPreview = false;
                alertSuccess.show();
            }, function(resp){ // ON FAIL
                alertFail.show();
            }, function(evt){ // UPDATE EVENT, WHILE FILE UPLOADS - PROGRESS
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '%' + evt.config.data.file.name);
            })
        }
    }
})();