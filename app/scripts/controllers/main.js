'use strict';

angular.module('tvshowmarkApp')
.controller('MainCtrl', function ($scope, $window) {
    //$scope.dashType = 'plan'; //in view?        
    //$scope.listName = 'Dashboard';                 
    //$scope.list = Dashboard.get();  
	//$scope.list = Dashboard.get();
	$scope.title = 'MainCtrl';
	$scope.sideWith = $window.innerWidth - 50;
});
