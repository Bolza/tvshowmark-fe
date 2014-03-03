'use strict';

angular.module('tvshowmarkApp')
.directive('season', function ($rootScope) {
	return {
		restrict: 'E',
		scope: {
			item: '='
		},
		link: function postLink(scope, element, attrs) {
			scope.watch = function() {
				console.log('season.watch',scope);
				//$rootScope.$broadcast('SeriesEvent', {'item': scope.item, 'action': 'watch', 'list': scope.listName});
			}
		}
	};
});
