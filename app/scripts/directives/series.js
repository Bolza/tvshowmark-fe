'use strict';

angular.module('tvshowmarkApp')
.directive('series', function ($rootScope) {
	return {
		templateUrl: 'views/item-series.html',
		restrict: 'E',
		link: function postLink(scope, element, attrs) {
			scope.zoom = function() {
				$rootScope.$broadcast('toZoom', scope.item);
			}
			scope.plan = function() {
				$rootScope.$broadcast('SeriesEvent', {'item': scope.item, 'action': 'plan', 'list': scope.listName});
			}
			scope.drop = function() {
				$rootScope.$broadcast('SeriesEvent', {'item': scope.item, 'action': 'drop', 'list': scope.listName});
			}
		}
	};
});
