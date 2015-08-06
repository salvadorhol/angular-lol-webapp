'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', '$interval', '$http', '$timeout', function($scope, $interval, $http, $timeout) {
	$interval(function(){
		$scope.currentTime = new Date();
	}, 1000);

	$scope.regionList = [
		{name: "North America", value: "na"},
		{name: "Europe", value: "eu"},
		{name: "Korea", value: "kr"}
	];

	$scope.selRegion = $scope.regionList[0];

	$scope.searchSummoner = function(key){
		key = key.keyCode || key.which;

		if(key === 13){
			
			//make sure the angular digest catches up, give it a little delay.
			$timeout(function(){
				var data = {region: $scope.selRegion.value.toLowerCase(), name: $scope.summonerName.toLowerCase()};

				$http.post('/engine.php?method=route', {class: "RiotAPI", function: "getLeague", data: data})
					.then(function(response){
						console.log("HomeCtrl.searchSummoner: response - ");
						console.log(response);
						var id = [];
						angular.forEach(Object.keys(response.data), function(smnr){
							id.push(smnr);
						})
						$scope.leagueData = response.data[id[0]][0]["entries"];
					})
			}, 200);
		}
	} 
}]);