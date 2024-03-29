'use strict';

angular.module('tvshowmarkApp')
.directive('season', function ($rootScope, Season) {
	var isCompleted = false;


	return {
		restrict: 'E',
		templateUrl: 'views/item-season.html',
		scope: {
			item: '=', 
			series: '=',
			startExpanded: '='
		},
		
		link: function postLink(scope, element, attrs) {
			var aired = 0;
			for (var i = 0; i < scope.item.episodes.length; i++) {
				if (scope.item.episodes[i].aired) aired++; 
			};

			//console.log('postLink',scope.item);
			scope.swatch = function(e) {
				e.stopPropagation(); //prevent watch on season to open accordion
				checkSeasonComplete();
				if (isCompleted) {
					Season.unwatch({'season': scope.item, 'series': scope.series});
				} else {
					Season.watch({'season': scope.item, 'series': scope.series});
				}
			}


			function checkSeasonComplete() {
				if (scope.item.user.watched_episodes >= scope.item.episodes.length) {
					scope.item.user.watched_episodes = scope.item.episodes.length;
					isCompleted = true;
					element.addClass('complete');
				}
				else if (scope.item.user.watched_episodes > 0 && aired == scope.item.user.watched_episodes) {
					element.addClass('even');
				}
				else if (scope.item.user.watched_episodes > 0 && aired < scope.item.user.watched_episodes) {
					element.addClass('late');
				}
				else {
					if (scope.item.user.watched_episodes < 0) scope.item.user.watched_episodes = 0;
					isCompleted = false;
					element.removeClass('complete');
				}
			}
			
			var d1 = $rootScope.$on('SeasonRefresh', checkSeasonComplete);
			var d2 = scope.$watch(item.episodes, checkSeasonComplete, true);

			element.on('$destroy', function(e) {
	        	d1(); d2();
	     	});



			//$rootScope.$on('EpisodeEvent', function() {
			//	console.log('Season directive',arguments)
			//})
			

		}
	};
});
