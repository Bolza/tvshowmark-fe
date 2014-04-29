'use strict';

angular.module('tvshowmarkApp')
.controller('MainCtrl', function ($rootScope, $scope, $window, Series, Season, Episode) {

	$scope.title = 'MainCtrl';
	$scope.sideWith = $window.innerWidth - 50;

	//episode
	$rootScope.$on('EpisodeEvent', function(e, data) {
		Series.set( data.series );
		$rootScope.$broadcast('SeasonRefresh', data);
	});

	//season
	$rootScope.$on('SeasonEvent', function(e, data) {
		Series.set( data.series );
		$rootScope.$broadcast('SeasonRefresh', data);
	});



	//{'series': data.series, 'episode': data.episode, 'action': action});


});
