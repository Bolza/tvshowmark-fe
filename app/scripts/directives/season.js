'use strict';

angular.module('tvshowmarkApp')
.directive('season', function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'views/item-season.html',
		scope: {
			item: '='
		},
		link: function postLink(scope, element, attrs) {
			console.log(scope, element,attrs);
			scope.swatch = function() {
				if (!scope.item.user.watched)
					$rootScope.$broadcast('EpisodeEvent', {'item': scope.item, 'action': 'watch', series: scope.series});
				else
					$rootScope.$broadcast('EpisodeEvent', {'item': scope.item, 'action': 'unwatch', series: scope.series});
			}
		}
	};
});
