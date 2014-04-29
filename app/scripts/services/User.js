'use strict';

angular.module('tvshowmarkApp')
.provider('User', function () {
    var memData = null;
    //var remoteUrl = '/api/v1/User/';
    var remoteUrl = 'http://app.tvshowmark.it/api/v1/user/';
    // Method for instantiating
    this.$get = function ($resource) {
        var please = $resource(remoteUrl, {}, {
            get: {method: 'GET'}
        });

        var login = function() {
            please.get(
                function success(e) {
                    memData = e;
                    console.log('User.success',e);
                },
                function failed(e) {
                    console.log('User.failed',e.status, e.data);
                }
            );
        }
        
        return {
            login: login,
            data: memData
        }
    };
/*

    // Private constructor
    function Greeter() {
        this.greet = function () {
            return salutation;
        };
    }
    // Public API for configuration
    this.setSalutation = function (s) {
        salutation = s;
    };
    
*/


});
