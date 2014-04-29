'use strict';

angular.module('tvshowmarkApp')
.factory('Season', function Season($rootScope, $resource, Episode) {
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
    var watch = function(data) {
        for (var i=0, item; item = data.season.episodes[i]; i++) {
            Episode.watch({'episode': item, 'series': data.series, 'noRemote': true});
        }
        
        $rootScope.$broadcast('SeasonEvent', {'series': data.series, 'action': 'watch'});
        toHTTP(data, 'watch');
    }
    var unwatch = function(data) {
        for (var i=0, item; item = data.season.episodes[i]; i++) {
        	Episode.unwatch({'episode': item, 'series': data.series, 'noRemote': true});
    	}

       $rootScope.$broadcast('SeasonEvent', {'series': data.series, 'action': 'unwatch'});
       toHTTP(data, 'unwatch');
    }

    // TO BE IMPLEMENTED
    // IMPROVEMENT: Pass entire season and series_id
    var toHTTP = function(data, action) {
    	var ids = [];
    	for (var i = 0, ep; ep = data.season.episodes[i]; i++) {
    		ids.push(ep.tvdb_id);
    	};
        return please[action]({tvdb_id: ids}, 
        function() {
            console.log('Season --> toHTTP --> SUCCESS');
            $rootScope.$broadcast('SeriesEvent', {'series': data.series, 'action': action});
        },
        function(e) {
            console.log('Season --> toHTTP --> FAIL',e);
            $rootScope.$broadcast('SeriesEvent', {'series': data.series, 'action': action});
            //toActionList(e);
        });
    }

    /** 
        data {
            item: the season
        }
    */
    /*
    $rootScope.$on('EpisodeEvent', function(ev, data) {
        console.log('EpisodeEvent', data);
        switch(data.action) {
            case 'watch':
                watch_episodes(data.item, data.series);
            break;
            case 'unwatch':
                unwatch_episodes(data.item, data.series);
            break;
        }
    });
    */
    return {
    	user: user,
    	status: status,
        watch: watch,
        unwatch: unwatch
    }
});
