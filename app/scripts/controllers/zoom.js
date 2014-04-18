'use strict';

angular.module('tvshowmarkApp')
.controller('ZoomCtrl', function ($scope, $stateParams, Series, Season) {
	$scope.offlineCapable = true
	var id = $stateParams.tvdb_id;
	//$scope.listName = 'Dashboard';
	window.item = $scope.item = Series.get(id);

});
