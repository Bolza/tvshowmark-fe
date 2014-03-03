'use strict';

angular.module('tvshowmarkApp')
.controller('ZoomCtrl', function ($rootScope, $scope, $routeParams, Series) {
	$scope.offlineCapable = true
	var id = $routeParams.tvdb_id;
	//$scope.listName = 'Dashboard';
	window.item = $scope.item = Series.get(id);

});
