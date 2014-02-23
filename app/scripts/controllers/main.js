'use strict';

angular.module('tvshowmarkApp')
.controller('MainCtrl', function ($rootScope, $scope, Dataprovider) {
    $scope.dashType = 'plan'; //in view?        
    $scope.listName = 'UserList';                 
    $scope.list = Dataprovider.getUserSeries();  
});
