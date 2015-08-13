'use strict';

angular.module('myApp.summoner', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/summoner/:region/:name', {
    templateUrl: 'summoner/summoner.html',
    controller: 'SummonerCtrl'
  });
}])

.controller('SummonerCtrl', ['$scope', '$routeParams', '$log', '$http', '$interval', 'SummonerService', function($scope, $routeParams, $log, $http, $interval, SummonerService){
	$scope.url = $routeParams.region + "/" + $routeParams.name;
	console.log($routeParams);

	$scope.loadingDots = "";
	//for interval, do something every 800 miliseconds
	var loading = $interval(function(){
		if($scope.loadingDots.length == 0) $scope.loadingDots = ".";
		else if($scope.loadingDots.length == 1) $scope.loadingDots = "..";
		else if ($scope.loadingDots.length == 2) $scope.loadingDots = "...";
		else $scope.loadingDots = "";
	}, 250);

	var ajaxData = {region: $routeParams.region, name: $routeParams.name, summoner: SummonerService.summoner};
	console.log("SummonerCtrl.ajaxData: - "); console.log(ajaxData);

	//gets called when controller loads :D
	$http.post('/engine.php?method=route', {class: "RiotAPI", function: "getProfile", data: ajaxData})
		.then(function(response){
				console.log("SummonerCtrl.RiotAPI.getProfile: Response - "); 
				console.log(response.data);
				
				//pre filtering for leagues only if not null
				if(response.data.league){
					angular.forEach(response.data.league[response.data.id], function(league){
						//console.log(league);
						response.data.league[league.queue] = league;

						//if he played and placed into solo queue
						if(league.queue === "RANKED_SOLO_5x5"){
							var entries = response.data.league[league.queue].entries;
							var me = entries[findWithAttr(entries,'playerOrTeamId', response.data.id)];
							me.rankicon = "img/medals/" + response.data.league[league.queue].tier + me.division + ".png";
							response.data.league.soloqueue = me;
						}
					});
				}

				//pre filtering for matches
				if(response.data.match){
					angular.forEach(response.data.match.games, function(match){
						
					})
				}

				$interval.cancel(loading);
				$scope.summoner = response.data;

		//when we get something other than 400
		}, function(error){
			window.alert("HELP");
		})

}]);