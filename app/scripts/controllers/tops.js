'use strict';

angular.module('tvshowmarkApp')
.controller('TopsCtrl', function ($rootScope, $scope, Dashboard, Series) {

	$scope.list = Dashboard.get();

});
