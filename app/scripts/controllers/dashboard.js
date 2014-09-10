'use strict';

angular.module('tvshowmarkApp')
.controller('DashboardCtrl', function ($scope, Dashboard,$window) {
	$scope.offlineCapable = true;
	$scope.listName = 'Dashboard';
	$scope.dashType = null;
	$scope.list = Dashboard.get();
	$scope.myfilter = {};
	console.log('Dashboard.list',$scope.list);
	var selectedTab = null;
	
	$scope.onTabSelected = function(type) {
		$scope.dashType = type.toLowerCase();
		var tab = $window.document.querySelector('#dashboard');
		if (selectedTab) tab.classList.remove(selectedTab);
		tab.classList.add($scope.dashType);
		selectedTab = $scope.dashType;

		//var filterText = selectedTab == 'history' ? filterText = 'drop' : filterText = selectedTab;
		//$scope.myfilter = {user: {status: filterText }};
	}

	$scope.doRefresh = function() {
		console.log('doRefresh',arguments);
		$scope.$broadcast('scroll.refreshComplete');
	}
	
	$scope.onTabSelected('Watching');
})


.filter('statusFilter', function() {
    return function(list, wantedStatus) {
    	if (!list) return [];
    	wantedStatus = wantedStatus.toLowerCase();
    	var newList = [];
    	for(var i=0, item; item = list[i]; i++) {
    		var itemStatus = item.user.status.toLowerCase();
    		if (wantedStatus == 'history' && (itemStatus == 'drop' || itemStatus == 'completed')) {
    			newList.push(item);
    		}
    		else if (itemStatus == wantedStatus) {
    			newList.push(item);	
    		} 
    	}
        return newList; 
    };
});
