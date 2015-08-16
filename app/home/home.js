'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])
.factory("Home", function($q, $log, $http){
	return {
		getExist: function(data){
			//declare a promise
			var p = $q.defer();

			$http.post("/engine.php?method=route", {class: "Home", function: "getExist", data: data})
				.then(function(summoner){
					log(summoner, "Home.getExist: success - ");
					p.resolve(summoner);
				}, function(){
					log(data, "Home.getExist: failure - ", "e");
					p.reject(null);
				})

			return p.promise;
		}
	}
})
.controller('HomeCtrl', ['$scope', '$interval', '$http', '$timeout', '$location', 'SummonerService', "Home", function($scope, $interval, $http, $timeout, $location, SummonerService, Home){
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

	//clear out summoner when you load this controller
	SummonerService.summoner = {};

	$scope.searchSummoner = function(key){
		key = key.keyCode || key.which;

		if(key === 13){
			
			if($scope.summonerName.length > 0){
				//make sure the angular digest catches up, give it a little delay.
				$timeout(function(){

					//form object
					var data = {region: $scope.selRegion.value.toLowerCase(), name: $scope.summonerName.toLowerCase()};

					Home.getExist(data).then(function(summoner){
						SummonerService.summoner = summoner.data;
						$location.path('/summoner/' + data.region + '/' + data.name);
					})
					.catch(function(){
						$scope.errorMessage = "Ikuu!!";
					})
				}, 200);
			} else angular.element("#summonerName").focus();
		}
	} 
}]);