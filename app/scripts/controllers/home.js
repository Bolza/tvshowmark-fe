'use strict';

angular.module('tvshowmarkApp')
.controller('HomeCtrl', function ($scope, User) {
	$scope.title = 'HomeCTRL';

	$scope.startLogin = function() {
		User.login();
	}


});
