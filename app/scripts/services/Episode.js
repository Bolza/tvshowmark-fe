'use strict';

angular.module('tvshowmarkApp')
.factory('Episode', function ($rootScope, $resource) {
    var name = 'Episode';
    var remoteUrl = '/api/v1/user/:action';
    var memData = {};

    var please = $resource(remoteUrl, {}, {
        watch: {method: 'POST', params: {action: 'watch'}},
        unwatch: {method: 'POST', params: {action: 'unwatch'}}
    });

    var actionList = [];
    var toActionList = function(e) {
        actionList.push(e);
        console.log('actionList',actionList)
    }

    var getSeason = function(data) {
       for (var i = 0, sea; sea = data.series.seasons[i]; i++) {
            if (sea.season == data.episode.season) {
                if (sea.user.watched_episodes > sea.episodes.length) sea.user.watched_episodes = sea.episodes.length;
                else if (sea.user.watched_episodes < 0) sea.user.watched_episodes = 0;
                return sea;
            }
        }
    }

    var actions = {
        watch: function(data) {
            data.episode.user.watched = new Date().getTime(); //toMem
            getSeason(data).user.watched_episodes++;
            if (!data.noRemote) toHTTP(data, 'watch');
        },
        unwatch: function(data) {
            data.episode.user.watched = undefined;
            getSeason(data).user.watched_episodes--;
            if (!data.noRemote) toHTTP(data, 'unwatch');
        }
    }

    var toHTTP = function(data, action) {
        return please[action]({tvdb_id: [data.episode.tvdb_id]}, 
        function() {
            //console.log('Episode --> toHTTP --> SUCCESS');
            $rootScope.$broadcast('EpisodeEvent', {'series': data.series, 'episode': data.episode, 'action': action});
        },
        function(e) {
            //console.log('Episode --> toHTTP --> FAIL',data);
            $rootScope.$broadcast('EpisodeEvent', {'series': data.series, 'episode': data.episode, 'action': action}); //todo:dev
        });
    }
    
    // data { episode, series }
    return {
        watch: actions.watch,
        unwatch: actions.unwatch
    }
});
