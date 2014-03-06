'use strict';

angular.module('tvshowmarkApp')
.directive('episode', function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'views/item-episode.html',
		scope: {
			series: '=',
			item: '='
		},
		link: function postLink(scope, element, attrs) {

			scope.swatch = function() {
				if (!scope.item.user.watched)
					$rootScope.$broadcast('EpisodeEvent', {'item': scope.item, 'action': 'watch', series: scope.series});
				else
					$rootScope.$broadcast('EpisodeEvent', {'item': scope.item, 'action': 'unwatch', series: scope.series});
			}
		}
	};
});
