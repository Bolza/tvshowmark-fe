'use strict';

angular.module('tvshowmarkApp')
.factory('Dashboard', function Dashboard($resource, $rootScope, $window) {
    var memData;
    var remoteUrl = '/api/v1/user/:action/';
    var name = 'Dashboard';
    var please = $resource(remoteUrl, {}, {
        get: {method: 'GET', params: {action: 'dashboard'}}
    });

    var actionList = [];
    var toActionList = function(e) {
        actionList.push(e);
        console.log('actionList',actionList)
    }

    var get = function() {
        var mem = fromMEM() || fromLS();
        if (!mem) mem = fromHTTP();
        return mem;
    }
    var set = function (data) {
        toMEM(data, true);
    }
    /*
        Only saves the current image of the list inside LocalStorage
        Cant save the list upstream on the server, 
        it's just a shortcut to have the list with all items refreshed
    */
    var save = function() {
        set(get());
    }

    var fromMEM = function() {
        console.log('Dashboard <-- fromMEM');
        return memData;
    }
    var fromHTTP = function() {
        console.log('Dashboard <-- fromHTTP');
        return please.get(function(res) {
            toMEM(res);
            toLS(res)
        }, toActionList);
    }
    var fromLS = function() {
        console.log('Dashboard <-- fromLS');
        var data = $window.localStorage.getItem(name);
        data = JSON.parse(data);
        toMEM(data);
        return data;
    }

    var toMEM = function(data) {
        console.log('Dashboard --> toMEM')
        memData = data;
        toLS(data);
        return data;
    }
    var toLS = function(data) {
        console.log('Dashboard --> toLS');
        $window.localStorage.setItem(name, JSON.stringify(data));
        return data;
    }
    
    $rootScope.$on('SeriesChangeEvent', save);

    return {
        get: get
    }
});

