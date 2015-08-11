'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])
.controller('HomeCtrl', ['$scope', '$interval', '$http', '$timeout', '$location', 'SummonerService', function($scope, $interval, $http, $timeout, $location, SummonerService){
	$interval(function(){
		$scope.currentTime = new Date();
	}, 1000);

	$scope.regionList = [
		{name: "North America", value: "na"},
		{name: "Europe North East", value: "eune"},
		{name: "Europe West", value: "euw"},
		{name: "Latin America North", value: "lan"},
		{name: "Latin America South", value: "las"},
		{name: "Oceanic", value: "oce"},
		{name: "Turkey", value: "tr"},
		{name: "Russia", value: "ru"},
		{name: "Brazil", value: "br"},
		{name: "PBE", value: "pbe"},
		{name: "Korea", value: "kr"}
	];

	$scope.selRegion = $scope.regionList[0];

	$scope.searchSummoner = function(key){
		key = key.keyCode || key.which;

		if(key === 13){
			
			//make sure the angular digest catches up, give it a little delay.
			$timeout(function(){
				//form object
				var data = {region: $scope.selRegion.value.toLowerCase(), name: $scope.summonerName.toLowerCase()};

				//does summoner exists
				$http.post("/engine.php?method=route", {class:"RiotAPI", function: "getExist", data: data})
					.then(function(summoner){
						SummonerService.summoner = summoner.data;
						$location.path('/summoner/' + data.region + '/' + data.name);
					}, function(){
						$scope.errorMessage = "Ikuuu!!!!";
					})

				
			}, 200);
		}
	} 
}]);