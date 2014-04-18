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

    var set = function (item) {
        toMEM(item, true);
    }

    /*
        actions.{action} ( item )
    */
    var actions = {
        //TODO watch_episode shouldnot be here
        plan: function(item) {
            item.user.status = 'plan';
            toMEM(item, true, 'plan');
        },
        drop: function(item) {
            item.user.status = 'drop';
            toMEM(item, true, 'drop');
        }
    }

    var fromMEM = function(id) {
        console.log('Series <-- fromMEM');
        return memData[id];
    }
    var fromLS = function(id) {
        console.log('Series <-- fromLS', id);
        var data = $window.localStorage.getItem(id);
        data = JSON.parse(data);
        return data;
    }
    var fromHTTP = function(id) {
        return please.get({'tvdb_id': id}, 
        function(res) {
            console.log('<-- fromHTTP SUCCESS', id);
            toMEM(res);
        }, 
        function(e) {
            console.log('<-- fromHTTP FAIL', id);
            toActionList(e);
        });
    }

    var toMEM = function(item, saveRemote, action) {
        console.log('Series --> toMEM', item.tvdb_id, action, saveRemote == true)
        memData[item.tvdb_id] = item;
        if (saveRemote) toHTTP(item, action);
        else            toLS(item);
        return item;
    }

    // TO BE IMPLEMENTED
    var toHTTP = function(item, action) {
        console.log('Series --> toHTTP',item.tvdb_id);
        toLS(item); // todo:dev
        return;

        return please[action]({'id': item.tvdb_id}, 
        function() {
            console.log('Series --> toHTTP --> SUCCESS');
            toLS(item);
        },
        function(e) {
            console.log('Series --> toHTTP --> FAIL',e);
            toActionList(e);
        });
    }
    var toLS = function(item) {
        console.log('Series --> toLS', item.tvdb_id);
        $window.localStorage.setItem(item.tvdb_id, JSON.stringify(item));
        //and in dashboard and tops list?
        $rootScope.$broadcast('SeriesChangeEvent', {'item': item });
        return item;
    }

    $rootScope.$on('SeriesEvent', function(ev, evdata) {
        console.log('SeriesEvent', evdata);
        switch(evdata.action) {
            case 'plan':
                actions.plan(evdata.item);
            break;
            case 'drop':
                actions.drop(evdata.item);
            break;
            case 'watch':
            case 'unwatch':
                toLS(item)
            break;
        }
        //toLS(evdata.item);
    });

    return {
        get: get, //return [seriesItem] future object
        //set: function(data) {return memData[id] = data},  //(seriesItem.id, action) return seriesItem please.plan({id:tvdb_id},toMEM, toActionList);
        //remote: please
    }
});
