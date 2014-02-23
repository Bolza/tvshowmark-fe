'use strict';

angular.module('tvshowmarkApp')
.controller('ZoomCtrl', function ($rootScope, $scope, Dataprovider) {
	$scope.offlineCapable = true
	$scope.listName = 'UserList';;
	$scope.list = Dataprovider.getUserSeries();
});
