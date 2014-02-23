'use strict';

angular.module('tvshowmarkApp')
.factory('Dataprovider', function Dataprovider($rootScope, $window) {
    var memData = {};
        var series = [];
    var getMockSeriesHTTP = function() {
        console.log('HTTP Call (Mocked)');
        for (var i = 0; i < 1000; i++) {
            series.push({id:'x'+i, name: 'serie'+i, state: ''});
        };
        return series;
    } 

    var get = function(name) {
        if (!memData[name]) {
            memData[name] = fromLS(name);   
        }
        if (!memData[name]) {
            memData[name] = fromHTTP(name);   
        }
        return fromMEM(name);
    }
    var set = function(name, data) {
        toMEM(name, data);  toHTTP(name, data); toLS(name, data);//solo se HTTP è ok -> toLS
    }   
    var fromHTTP = function(name) {
        //after arrivati dati con promise setta il LS
        console.log(name,'<-- fromHTTP');
        memData[name] = getMockSeriesHTTP();
        return memData[name];//set(name,getMockSeriesHTTP());
    }
    var toHTTP = function(name, data) {
        console.log(name, '--> toHTTP');
        memData[name] = data;
    }
    var fromMEM = function(name) {
        console.log(name, '<-- fromMEM');
        return memData[name];
    }
    var toMEM = function(name, data) {
        console.log(name, '--> toMEM');
        memData[name] = data;
    }
    var fromLS = function(name) {
        console.log(name, '<-- fromLS');
        var data = $window.localStorage.getItem(name);
        return JSON.parse(data);
    }
    var toLS = function(name, data) {
        console.log(name, '--> toLS');
        $window.localStorage.setItem(name, JSON.stringify(data));
        return data;
    }
    $rootScope.$on('seriesEvent', function(ev, data) {
        data.item.state = data.action;
        set(data.list, get(data.list));
        //set(data.item.id, data.item);
    });

    return {
        getUserSeries: function() {
            return get('UserList');
        }
    }
});
