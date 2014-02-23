'use strict';

angular.module('tvshowmarkApp')
.directive('seriesactions', function ($rootScope) {
	return {
		restrict: 'E',
		link: function postLink(scope, element, attrs) {
			scope.drop = function() {
				$rootScope.$broadcast('seriesEvent', {'item': scope.item, 'action': 'clear', 'list': scope.listName});
			};
			scope.watch = function() {
				$rootScope.$broadcast('seriesEvent', {'item': scope.item, 'action': 'watch', 'list': scope.listName});
			}
			
		}
	};
});
