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
			scope.$watch('item.user.watched', function() {
				scope.item.user.watched ? element.addClass('episode-watched') : element.removeClass('episode-watched');
			});
			scope.swatch = function() {
				if (!scope.item.user.watched) {
					//scope.item.user.watched = true;
					$rootScope.$broadcast('EpisodeEvent', {'item': scope.item, 'action': 'watch', series: scope.series});
				}
				else {
					//scope.item.user.watched = undefined;
					$rootScope.$broadcast('EpisodeEvent', {'item': scope.item, 'action': 'unwatch', series: scope.series});
				}

			}
		}
	};
});
