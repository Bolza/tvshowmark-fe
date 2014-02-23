'use strict';

angular.module('tvshowmarkApp')
.controller('TopsCtrl', function ($rootScope, $scope, Dataprovider) {
	$scope.offlineCapable = false;
	$scope.listName = 'UserList';
	$scope.list = Dataprovider.getUserSeries();
});
