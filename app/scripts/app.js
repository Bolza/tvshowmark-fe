'use strict';

angular.module('tvshowmarkApp', [
    'ngResource',
    , 'ionic'
    ])
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('main', {
        url: "/home",
        templateUrl: "views/main.html",
        controller: 'MainCtrl',
        abstract:true
    })
    .state('main.home', {
        url: "/homes",
        views: {
            'centralView': {
                controller: 'HomeCtrl',
                templateUrl: "views/home.html"
            }
        }
    })
    .state('zoom', {
        url: "/zoom/:tvdb_id",
        views: {
            'centralView' :{
                templateUrl: "views/zoom.html"
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