'use strict';

angular.module('tvshowmarkApp')
    .factory('remote', function ($resource, $q) {
    var remoteUrl = 'http://app.tvshowmark.it/api/v1/user/:action/';
    var please = $resource(remoteUrl, {tvdb_id: '@id'}, {
        plan: {method: 'POST', params: {action: 'plan/'}},
        get: {method: 'POST', params: {action: 'Dashboard/'}}
    });

    // Public API here
    return {
        set: function (id, action) {
            var def = $q.defer();

            please.plan({tvdb_id: id}, 
                function(e) {
                    console.log('successo',e);
                    def.resolve(e);    
                },
                function(e) {
                    console.log('morte',e);
                    def.resolve(e);    
                }
            );
            return def.promise;
        }
    };
});
