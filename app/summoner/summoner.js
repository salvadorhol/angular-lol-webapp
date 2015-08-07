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
			console.log("HomeCtrl.searchSummoner: response - ");
			console.log(response);
			$scope.summoner = response.data;
		})
}]);