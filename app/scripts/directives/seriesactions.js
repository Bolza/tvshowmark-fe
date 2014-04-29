'use strict';

angular.module('tvshowmarkApp')
.directive('seriesactions', function ($rootScope, Series) {
	return {
		restrict: 'E',
		link: function postLink(scope, element, attrs) {
			scope.plan = function() {
				Series.plan(scope.item);
			};
			scope.drop = function() {
				Series.drop(scope.item);
			};
			scope.watch = function() {
				
			}
			
		}
	};
});
