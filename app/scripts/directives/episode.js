'use strict';

angular.module('tvshowmarkApp')
.directive('episode', function ($rootScope, Episode) {
	return {
		restrict: 'E',
		templateUrl: 'views/item-episode.html',
		scope: {
			series: '=',
			item: '='
		},
		link: function postLink(scope, element, attrs) {
			//avviene sia al watch manuale che a quello imposto dai WatchAll (Season e Series)
			var d1 = scope.$watch('item.user.watched', function() {
				scope.item.user.watched ? element.addClass('complete') : element.removeClass('complete');
			});
			scope.swatch = function() {
				if (!scope.item.user.watched) {
					Episode.watch({'episode': scope.item, 'series': scope.series});
				}
				else {
					Episode.unwatch({'episode': scope.item, 'series': scope.series});
				}
			}

			element.on('$destroy', function(e) {
	        	d1();  
	     	});

		}
	};
});
