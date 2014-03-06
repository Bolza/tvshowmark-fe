'use strict';

angular.module('tvshowmarkApp')
.factory('Series', function ($rootScope, $resource, $window, Episode) {
    var name = 'Series';
    var remoteUrl = '/api/v1/tvshow/:tvdb_id';
    var memData = {};
    //GET  /api/v2/tvshow/:tvdb_id
    //GET  /api/v2/tvshow/:tvdb_id/similar
    //POST /api/v2/tvshow/:tvdb_id/plan || post:plan
    //POST /api/v2/tvshow/:tvdb_id/drop || post:drop
    //POST /api/v2/tvshow/:tvdb_id(ep)/watch || post:watch
    //POST /api/v2/tvshow/:tvdb_id(ep)/unwatch || post:unwatch

    var please = $resource(remoteUrl, {}, {
        get: {method: 'GET', params: {tvdb_id: '@tvdb_id'}},
        get_similar: {method: 'GET', params: {tvdb_id: '@id/similar'}},
        plan: {method: 'POST', params: {action: 'plan', tvdb_id: '@id'}},
        drop: {method: 'POST', params: {action: 'drop', tvdb_id: '@id'}}
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
            toLS(res);
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

    // TO BE IMPLEMENTED
    var toHTTP = function(item, action, series) {
        console.log(item, series);
        //toLS(item); // todo:dev
        return please[action]({id: item.tvdb_id}, 
        function() {
            console.log('--> toHTTP --> SUCCESS');
            toLS(data);
        },
        function(e) {
            console.log('--> toHTTP --> FAIL',e);
            toActionList(e);
        });
    }
    var toLS = function(data) {
        console.log('--> toLS', data);
        $window.localStorage.setItem(data.tvdb_id, JSON.stringify(data));
        return data;
    }

    $rootScope.$on('SeriesEvent', function(ev, data) {
        console.log('SeriesEvent', data);
        switch(data.action) {
            case 'watch':
            case 'unwatch':
                toLS(data.item)     
            break;
        }

    });

    return {
        get: get, //return [seriesItem] future object
        //set: function(data) {return memData[id] = data},  //(seriesItem.id, action) return seriesItem please.plan({id:tvdb_id},toMEM, toActionList);
        //remote: please
    }
});
