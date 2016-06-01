(function() {
    'use strict';

    angular
        .module('app')
        .factory('vinylsAPI', vinylsAPI);

    vinylsAPI.$inject = ['$http']; //inject http service into the service

    function vinylsAPI($http) {
        return {
            createScrapeVinyl: createScrapeVinyl,
            getAllVinyls: getAllVinyls,
            getUserVinyls: getUserVinyls,
            findOneVinyl: findOneVinyl,
            popVinyls: popVinyls,
            getUpdateVinyl: getUpdateVinyl,
            updateVinyl: updateVinyl,
            deleteVinyl: deleteVinyl,
            upVoteVinyl: upVoteVinyl,
            addView: addView
        }

        function createScrapeVinyl(vinyl) {
            return $http.post('/api/vinyl/scrapeUpload', vinyl);
        }

        function getAllVinyls() {
            return $http.get('/api/vinyl/getAllVinyls', {
                cache: true
            });
        }

        function getUserVinyls(id) {
            return $http.get('/api/vinyl/getUserVinyls/?email=' + id, {
                cache: true
            });
        }

        function findOneVinyl(vinyl) {
            return $http.get('/api/vinyl/' + vinyl);
        }

        function popVinyls(vinyl) {
            return $http.get('/api/vinyl/popVinyls/' + vinyl);
        }

        function getUpdateVinyl(vinyl) {
            return $http.get('api/vinyl/' + vinyl._id);
        }

        function updateVinyl(vinyl) {
            return $http.put('api/vinyl/' + vinyl._id, vinyl);
        }

        function deleteVinyl(vinyl) {
            return $http.delete('/api/vinyl/' + vinyl._id);
        }

        function upVoteVinyl(vinyl){
            return $http.put('/api/vinyl/upvote/' + vinyl._id);
        }

        function addView(vinyl){
            return $http.put('/api/vinyl/view/' + vinyl);
        }
    }
})();