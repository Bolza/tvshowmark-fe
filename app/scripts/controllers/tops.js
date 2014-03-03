'use strict';

angular.module('tvshowmarkApp')
.controller('TopsCtrl', function ($rootScope, $scope, Dashboard) {
	$scope.offlineCapable = false;
	$scope.listName = 'Dashboard';
	$scope.list = Dashboard.get();
	
	

});
