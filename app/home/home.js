'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', '$interval', '$http', function($scope, $interval, $http) {
	$interval(function(){
		$scope.currentTime = new Date();
	}, 1000);

	$scope.regionList = [
		{name: "North America", value: "NA"},
		{name: "Europe", value: "EU"},
		{name: "Korea", value: "KR"}
	];

	$scope.selRegion = $scope.regionList[0];

	$scope.searchSummoner = function(key){
		key = key.keyCode || key.which;

		if(key === 13){
			var data = {region: "NA", name: "Sal"};

			$http.post('/engine.php?method=route', {class: "RiotAPI", function: "", data: data})
				.then(function(response){
					console.log("HomeCtrl.searchSummoner: response - ");
					console.log(response);
				})
		}
	} 
}]);