'use strict';

angular.module('tvshowmarkApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/zoom/:tvdb_id', {
        templateUrl: 'views/zoom.html',
        controller: 'ZoomCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
