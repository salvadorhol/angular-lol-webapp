'use strict';

angular.module('myApp.summoner', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/summoner', {
    templateUrl: 'summoner/summoner.html',
    controller: 'SummonerCtrl'
  });
}])

.controller('SummonerCtrl', [function() {

}]);