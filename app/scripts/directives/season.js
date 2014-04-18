'use strict';

angular.module('tvshowmarkApp')
.directive('season', function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'views/item-season.html',
		scope: {
			item: '=', 
			series: '=',
			startExpanded: '='
		},
		controller: function($scope) {
			$scope.expanded = $scope.startExpanded || false;
			console.log($scope.expanded, $scope.item, $scope.series);
			$scope.toggleSeason = function() {
				$scope.expanded = !$scope.expanded;
			}
		},
		link: function postLink(scope, element, attrs) {
			//console.log('postLink',scope.item);
			scope.swatch = function() {
				if (scope.item.user.watched_episodes < scope.item.episodes.length) 
					$rootScope.$broadcast('SeasonEvent', {'item': scope.item, 'action': 'watch', series: scope.series});
				else
					$rootScope.$broadcast('SeasonEvent', {'item': scope.item, 'action': 'unwatch', series: scope.series});
			}
		}
	};
});
