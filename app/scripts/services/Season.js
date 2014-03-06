'use strict';

angular.module('tvshowmarkApp')
.factory('Season', function Season($rootScope, $resource, $window) {
	var user = { watched_episodes: 0 };
	var status = null;
	var remoteUrl = '/api/v1/user/:action';
    
	var please = $resource(remoteUrl, {}, {
        watch: {method: 'POST', params: {action: 'watch'}},
        unwatch: {method: 'POST', params: {action: 'unwatch'}}
    });

	/** 
		Sets new watch or unwatch state on all the episodes of the season
		Does not launch an event for every episode changed
		Instead call remote with all the series ids 

        IMPROVEMENT: pass only series_id
	*/
    var watch_episodes = function(season, series) {
        console.log(season, series);
        for (var i=0, item; item = season.episodes[i]; i++) {
            item.user.watched = new Date().getTime(); //toMem
        }
        season.user.watched_episodes = season.episodes.length;
        toHTTP(season.episodes, 'watch', series);
    }
    var unwatch_episodes = function(season, series) {
        for (var i=0, item; item = season.episodes[i]; i++) {
        	item.user.watched = undefined;
    	}
        season.user.watched_episodes = 0;
        toHTTP(season.episodes, 'unwatch', series);
    }

    // TO BE IMPLEMENTED
    // IMPROVEMENT: Pass entire season and series_id
    var toHTTP = function(items, action, series) {
    	var ids = [];
    	for (var i = 0; i < items.length; i++) {
    		ids.push(items[i].tvdb_id);
    	};
        return please[action]({tvdb_id: ids}, 
        function() {
            console.log('Season --> toHTTP --> SUCCESS');
            $rootScope.$broadcast('SeriesEvent', {'item': series, 'action': action});
        },
        function(e) {
            console.log('Season --> toHTTP --> FAIL',e);
            $rootScope.$broadcast('SeriesEvent', {'item': series, 'action': action});
            //toActionList(e);
        });
    }

    /** 
        data {
            item: the season
        }
    */
    $rootScope.$on('SeasonEvent', function(ev, data) {
        console.log('SeasonEvent', data);
        switch(data.action) {
            case 'watch':
                watch_episodes(data.item, data.series);
            break;
            case 'unwatch':
                unwatch_episodes(data.item, data.series);
            break;
        }
    });

    return {
    	user: user,
    	status: status
    }
});
