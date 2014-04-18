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

    var actions = {
        watch: function(data) {
            data.item.user.watched = new Date().getTime(); //toMem
            toHTTP(data, 'watch');
        },
        unwatch: function(data) {
            data.item.user.watched = undefined;
            toHTTP(data, 'unwatch');
        }
    }

    var toHTTP = function(data, action) {
        return please[action]({tvdb_id: data.item.tvdb_id}, 
        function() {
            console.log('Episode --> toHTTP --> SUCCESS');
            $rootScope.$broadcast('SeriesEvent', {'item': data.series, 'action': action});
            //$rootScope.$broadcast('SeriesChangeEvent', {'item': item });
        },
        function(e) {
            console.log('Episode --> toHTTP --> FAIL',e);
            $rootScope.$broadcast('SeriesEvent', {'item': data.series, 'action': action}); //todo:dev
            //$rootScope.$broadcast('SeriesChangeEvent', {'item': item }); 
            //toActionList(e);

        });
    }

    /** 
        data {
            item: the episode
        }
    */
    $rootScope.$on('EpisodeEvent', function(ev, data) {
        console.log('EpisodeEvent', data);
        switch(data.action) {
            case 'watch':
                actions.watch(data);
            break;
            case 'unwatch':
                actions.unwatch(data);
            break;
        }
    });

    return {

    }
});
