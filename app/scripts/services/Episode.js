'use strict';

angular.module('tvshowmarkApp')
.factory('Episode', function ($rootScope, $resource, $window) {
    var name = 'Episode';
    var remoteUrl = '/api/v1/user/:action';
    var memData = {};

    var please = $resource(remoteUrl, {}, {
        watch: {method: 'POST', params: {action: 'watch', tvdb_id: '@id'}},
        unwatch: {method: 'POST', params: {action: 'unwatch', tvdb_id: '@id'}}
    });

    var watch_episode = function(item, series) {
        item.user.watched = new Date().getTime(); //toMem
        toHTTP(item, 'watch', series);
    }
    var unwatch_episode = function(item, series) {
        item.user.watched = undefined;
        toHTTP(item, 'unwatch', series);
    }

    var toHTTP = function(item, action, series) {
        return please[action]({id: item.tvdb_id}, 
        function() {
            console.log('Episode --> toHTTP --> SUCCESS');
            $rootScope.$broadcast('SeriesEvent', {'item': series, 'action': action});
        },
        function(e) {
            console.log('Episode --> toHTTP --> FAIL',e);
            $rootScope.$broadcast('SeriesEvent', {'item': series, 'action': action});
            //toActionList(e);
        });
    }

    $rootScope.$on('EpisodeEvent', function(ev, data) {
        console.log('EpisodeEvent', data);
        switch(data.action) {
            case 'watch':
                watch_episode(data.item, data.series);
            break;
            case 'unwatch':
                unwatch_episode(data.item, data.series);
            break;
        }
    });

    return {

    }
});
