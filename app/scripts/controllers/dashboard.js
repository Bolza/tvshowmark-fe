'use strict';

angular.module('tvshowmarkApp')
.controller('DashboardCtrl', function ($scope, Dashboard,$window) {

	$scope.offlineCapable = true;
	$scope.listName = 'Dashboard';
	$scope.dashType = 'watching';
	$scope.list = Dashboard.get();
	console.log('Dashboard.list',$scope.list);
	
	$scope.onTabSelected = function(type) {
		$scope.dashType = type;
		$window.document.body.classList.add(type);
	}
	$scope.doRefresh = function() {
		console.log('doRefresh',arguments);
		$scope.$broadcast('scroll.refreshComplete');
	}
	$scope.onTabSelected('Watching');
});
	