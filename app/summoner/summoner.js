'use strict';

angular.module('myApp.summoner', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/summoner/:region/:name', {
    templateUrl: 'summoner/summoner.html',
    controller: 'SummonerCtrl'
  });
}])
.factory("Summoner", function($http, $q, ChampionService, SummonerService){
	return {
		getProfile: function(data){
			var p = $q.defer();

			//determine if we need the championList
			data.getChampionList = (ChampionService.championList.length == 0) ? true : false;

			//append Summoner basic object incase we can recycle it.
			data.summoner = SummonerService.summoner;

			$http.post("/engine.php?method=route", {class: "Summoner", function: "getProfile", data: data})
				.then(function(response){
					//cache Championlist if it was requested
					if(data.getChampionList) ChampionService.setChampionList(response.data.championList.data);

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
							match.cleanLabel = makeGameModeLabel(match.gameMode, match.subType);
							match.championObj = ChampionService.championList[findWithAttr(ChampionService.championList, 'key', match.championId)];
						})
					}

					log(response.data, "Summoner.getProfile: success - ");

					p.resolve(response.data);

				}, function(){
					log(data, "Summoner.getProfile: error -", "e");
					p.reject(null);
				})

			return p.promise;
		}
	}
})
.controller('SummonerCtrl', ['$scope', '$routeParams', '$log', '$http', '$interval', 'SummonerService', 'ChampionService', 'Summoner', function($scope, $routeParams, $log, $http, $interval, SummonerService, ChampionService, Summoner){
	$scope.url = $routeParams.region + "/" + $routeParams.name;
	//console.log($routeParams);

	$scope.loadingDots = "";
	//for interval, do something every 800 miliseconds
	var loading = $interval(function(){
		if($scope.loadingDots.length == 0) $scope.loadingDots = ".";
		else if($scope.loadingDots.length == 1) $scope.loadingDots = "..";
		else if ($scope.loadingDots.length == 2) $scope.loadingDots = "...";
		else $scope.loadingDots = "";
	}, 250);

	Summoner.getProfile($routeParams).then(function(response){
		$interval.cancel(loading);
		$scope.summoner = response;
	})
	.catch(function(){
		//something went wrong
	})

}]);