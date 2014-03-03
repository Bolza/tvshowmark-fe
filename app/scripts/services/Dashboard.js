'use strict';

angular.module('tvshowmarkApp')
.factory('Dashboard', function Dashboard($resource, $rootScope, $window) {
    var memData;
    var remoteUrl = '/api/v1/user/:action/';
    var name = 'Dashboard';
    var please = $resource(remoteUrl, {}, {
        //plan: {method: 'POST', params: {action: 'plan', tvdb_id: '@id'}},
        get: {method: 'GET', params: {action: 'dashboard'}}
    });

    var actionList = [];
    var toActionList = function(e) {
        actionList.push(e);
        console.log('actionList',actionList)
    }

    var get = function() {
        var memData = fromMEM() || fromLS();
        if (!memData) memData = fromHTTP();
        return memData;
    }
    var set = function (data) {
        toMEM(data, true);
    }

    var fromMEM = function() {
        console.log('<-- fromMEM');
        return memData;
    }
    var fromHTTP = function() {
        console.log('<-- fromHTTP');
        return please.get(function(res) {
            toMEM(res);
            toLS(res)
        }, toActionList);
    }
    var fromLS = function() {
        console.log('<-- fromLS');
        var data = $window.localStorage.getItem(name);
        data = JSON.parse(data);
        toMEM(data);
        return data;
    }

    var toMEM = function(data, saveRemote) {
        console.log('--> toMEM')
        memData = data;
        if (saveRemote) toHTTP(data);
        return data;
    }
    var toHTTP = function(data) {
        console.log('--> toHTTP --> SUCCESS');
        //Dashboard.remote.set
        return toLS(data); //if promise OK
    }
    var toLS = function(data) {
        console.log('--> toLS');
        $window.localStorage.setItem(name, JSON.stringify(data));
        return data;
    }

    $rootScope.$on('DashboardEvent', function(ev, data) {
        data.item.user.status = data.action; //nel controller è mejo
        set(get()); //nella risorsa.set OK
        //set(data.item.id, data.item);
    });


    return {
        get: get //return [seriesItem] future object
        //set: function(data) {return memData = data},  //(seriesItem.id, action) return seriesItem please.plan({id:tvdb_id},toMEM, toActionList);
        //remote: please
    }
});
