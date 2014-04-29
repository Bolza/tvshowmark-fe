'use strict';

angular.module('tvshowmarkApp', [
    'ngResource',
    'ionic',
    'ui.bootstrap'
])
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
        url: "/home",
        views: {
            'centralView': {
                controller: 'HomeCtrl',
                templateUrl: "views/home.html"
            },
            'leftView': {
                templateUrl: "views/tops.html"
            },
            'rightView': {
                templateUrl: "views/dashboard.html"
            }
        }
    })
    .state('zoom', {
        url: "/zoom/:tvdb_id",
        views: {
            'centralView' :{
                templateUrl: "views/zoom.html"
            },
            'leftView': {
                templateUrl: "views/tops.html"
            },
            'rightView': {
                templateUrl: "views/dashboard.html"
            }
        }
    })
    $urlRouterProvider.otherwise("/home");
})
/*
    .state('eventmenu.checkin', {
      url: "/check-in",
      views: {
        'menuContent' :{
          templateUrl: "check-in.html",
          controller: "CheckinCtrl"
        }
      }
    })
    .state('eventmenu.attendees', {
      url: "/attendees",
      views: {
        'menuContent' :{
          templateUrl: "attendees.html",
          controller: "AttendeesCtrl"
        }
      }
    })
  
*/