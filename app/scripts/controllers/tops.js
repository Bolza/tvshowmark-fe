'use strict';

angular.module('tvshowmarkApp')
.controller('TopsCtrl', function ($scope, Tops) {

	$scope.list = Tops.get();

});
