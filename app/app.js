'use strict';
var findWithAttr = null;
var makeGameModeLabel = null;

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.summoner',
  'myApp.version'
])
//service containing basic summoner object
.run(['$rootScope', function($rootScope){
	findWithAttr = function(arr, attr, value){
		for(var i = 0; i < arr.length; i++){
			if(arr[i][attr] == value) return i;
		}
	}

	makeGameModeLabel = function(mode, queue){
		mode = mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase();
		switch (queue) {
			case "RANKED_SOLO_5x5":
			queue = "Solo Queue";
			break;

			case "NORMAL_5x5_BLIND":
			queue = "Normal Blind 5s ";
			break;

			case "NORMAL":
			queue = "Normal 5s";
			break;

			default: 
				queue;
		};

		return mode + " - " + queue;
	}
}])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
  
  //$locationProvider.html5Mode(true);
}])
.service("SummonerService", function(){
	this.summoner = {};
})
.service("ChampionService", function(){
	//reference for inner scopes...
	var thisService = this;
	
	this.setChampionList = function(championObject){
		var array = [];

		angular.forEach(Object.keys(championObject), function(champName){
			array.push(championObject[champName]);
		})

		thisService.championList = array;
	};

	this.championList = [];
})