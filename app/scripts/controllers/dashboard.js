'use strict';

angular.module('tvshowmarkApp')
.controller('DashboardCtrl', function ($scope, Dashboard, Series) {

	$scope.offlineCapable = false;
	$scope.listName = 'Dashboard';
	$scope.dashType = 'plan' || 'watching' || 'history';
	$scope.list = Dashboard.get();
	console.log($scope.list);

});
	