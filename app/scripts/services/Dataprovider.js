'use strict';

angular.module('tvshowmarkApp')
    .factory('Dataprovider', function ($rootScope) {
        var resources = {};
        var actionList = [];
        var toActionList = function(e) {
            actionList.push(e);
            console.log('actionList',actionList)
        }

        


        // Public API here
        return {

        };
});
