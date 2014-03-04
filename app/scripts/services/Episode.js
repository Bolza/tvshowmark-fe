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


    var actionList = [];
    var toActionList = function(e) {
        actionList.push(e);
        console.log('actionList',actionList)
    }

    var get = function(id) {
        id = 79216; // todo:dev
        memData[id] = fromMEM(id) || fromLS(id);
        if (!memData[id]) memData[id] = fromHTTP(id);
        return memData[id];
    }
    var set = function (id, data) {
        toMEM(id, data, true);
    }

    var watch_episode = function(item, series) {
        item.user.watched = new Date().getTime(); //toMem
        toHTTP(item, 'watch', series);
    }
    var unwatch_episode = function(item, series) {
        item.user.watched = undefined;
        toHTTP(item, 'unwatch', series);
    }


    var fromMEM = function(id) {
        console.log('<-- fromMEM');
        return memData[id];
    }
    var fromLS = function(id) {
        console.log('<-- fromLS', id);
        var data = $window.localStorage.getItem(id);
        data = JSON.parse(data);
        return data;
    }
    var fromHTTP = function(id) {
        return please.get({tvdb_id: id}, 
            function(res) {
                console.log('<-- fromHTTP SUCCESS', id);
                toMEM(id, res);
                toLS(id, res);
            }, 
            function(e) {
                console.log('<-- fromHTTP FAIL', id);
                toActionList(e);
            });
    }

    var toMEM = function(id, data, saveRemote) {
        console.log('--> toMEM', id, saveRemote == true)
        memData[id] = data;
        if (saveRemote) toHTTP(id, data);
        return data;
    }
    var toHTTP = function(item, action, series) {
        console.log(item, series);
    //toLS(item); // todo:dev
    return please[action]({id: item.tvdb_id}, 
        function() {
            console.log('--> toHTTP --> SUCCESS');
            $rootScope.$broadcast('SeriesEvent', {'item': series, 'action': action});
        },
        function(e) {
            console.log('--> toHTTP --> FAIL',e);
            $rootScope.$broadcast('SeriesEvent', {'item': series, 'action': action});
            //toActionList(e);
        });
    }

    // TODO: toLS entire series
    var toLS = function(data) {
        console.log('--> toLS');
        $window.localStorage.setItem(data.tvdb_id, JSON.stringify(data));
        return data;
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
    //get: get //return [seriesItem] future object
    //set: function(data) {return memData = data},  //(seriesItem.id, action) return seriesItem please.plan({id:tvdb_id},toMEM, toActionList);
    //remote: please
    }
});
