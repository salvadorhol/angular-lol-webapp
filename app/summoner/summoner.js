'use strict';

angular.module('myApp.summoner', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/summoner/:region/:name', {
    templateUrl: 'summoner/summoner.html',
    controller: 'SummonerCtrl'
  });
}])

.controller('SummonerCtrl', ['$scope', '$routeParams', '$log', '$http', function($scope, $routeParams, $log, $http) {
	$scope.url = $routeParams.region + "/" + $routeParams.name;
	console.log($routeParams);

	//gets called when controller loads :D
	$http.post('/engine.php?method=route', {class: "RiotAPI", function: "getLeague", data: $routeParams})
		.then(function(response){
			//pre filtering
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

			})

			console.log("HomeCtrl.searchSummoner: response - ");
			console.log(response);

			$scope.summoner = response.data;
		})
}]);