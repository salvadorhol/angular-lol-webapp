'use strict';

angular.module('myApp.summoner', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/summoner/:region/:name', {
    templateUrl: 'summoner/summoner.html',
    controller: 'SummonerCtrl'
  });
}])
.service("CurrentMatchFilter", function($log, ChampionService, RuneService){
	this.filter = function(cg){
		var filtered = {};

		//participants
		var blueTeam = []; 
		var redTeam = [];

		angular.forEach(cg.participants, function(summoner){
			//Assign championObj using championId. This represents what champion they are playing.
			summoner.championObj =  ChampionService.championList[findWithAttr(ChampionService.championList, 'key', summoner.championId)];

			//Aggregate run information. 
			angular.forEach(summoner.runes, function(rune, index){
				summoner.runes[index] = {
					data: RuneService.runeList[rune.runeId],
					count: rune.count,
					name: RuneService.runeList[rune.runeId].name,
					sum: rune.count * RuneService.runeList[rune.runeId].stats[Object.keys(RuneService.runeList[rune.runeId].stats)[0]]
				};
			})

			if(summoner.teamId === 100) blueTeam.push(summoner);
			else redTeam.push(summoner);
		})

		filtered.participants = {blueTeam: blueTeam, redTeam: redTeam};


		var blueBanned = [];
		var redBanned = [];

		//banned champions
		angular.forEach(cg.bannedChampions, function(champion){
			champion.championObj = ChampionService.championList[findWithAttr(ChampionService.championList, 'key', champion.championId)];
			if(champion.teamId === 100) blueBanned.push(champion);
			else redBanned.push(champion);
		})

		filtered.championBans = {blueBanned: blueBanned, redBanned: redBanned};


		return filtered;
	}
})
.factory("Summoner", function($http, $q, ChampionService, $log, SummonerService, ItemService, RuneService, CurrentMatchFilter){
	return {
		getProfile: function(data){
			var p = $q.defer();

			//determine if we need the championList
			data.getChampionList = (ChampionService.championList.length == 0) ? true : false;
			//same as above, for items
			data.getItemList = (ItemService.itemList.length == 0) ? true : false;
			//same for runes
			data.getRuneList = (RuneService.runeList.length == 0) ? true : false;

			//append Summoner basic object incase we can recycle it.
			data.summoner = SummonerService.summoner;

			$http.post("/engine.php?method=route", {class: "Summoner", function: "getProfile", data: data})
				.then(function(response){
					//cache Championlist if it was requested
					try {
						if(data.getChampionList) ChampionService.setChampionList(response.data.championList.data);
						if(data.getItemList) ItemService.itemList = response.data.itemList.data; 
						if(data.getRuneList) RuneService.runeList = response.data.runeList.data;
					} catch (e) {
						$log.error(e);
					}

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
						response.data.match.lostTotal = 0;
						response.data.match.winTotal = 0;

						angular.forEach(response.data.match.games, function(match){
							if(match.stats.win) response.data.match.winTotal++;
							if(!match.stats.win) response.data.match.lostTotal++;
							match.cleanLabel = makeGameModeLabel(match.gameMode, match.subType);
							match.championObj = ChampionService.championList[findWithAttr(ChampionService.championList, 'key', match.championId)];
							//calc kda
							match.kda = (function(){
								var kills = match.stats.championsKilled;
								var assist = match.stats.assists;
								var deaths = match.stats.numDeaths;

								var KDA = null;
								kills = (!kills) ? 0 : kills;
								assist = (!assist) ? 0 : assist;
								KDA = (!deaths) ? kills + assist : (kills + assist) /deaths;

								return Math.round(KDA*100)/100;
							})();
						})

						//if you want to have this feature for more games, make sure you do the right math
						response.data.match.lostTotal = response.data.match.lostTotal * 10;
						response.data.match.winTotal = response.data.match.winTotal * 10;
					}

					//filter participants, championBans
					if(response.data.currentGame)
						response.data.currentGame.filtered = CurrentMatchFilter.filter(response.data.currentGame);					


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

	//makes an ajax to pull data for summoner
	Summoner.getProfile($routeParams).then(function(response){
		$interval.cancel(loading);
		$scope.summoner = response;
	})
	.catch(function(){
		//something went wrong
	})

}]);