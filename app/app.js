'use strict';

//globals
var findWithAttr = null;
var makeGameModeLabel = null;
var log = null;

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap',
  'myApp.home',
  'myApp.summoner',
  'myApp.version'
])
//service containing basic summoner object
.run(['$rootScope', '$log', function($rootScope, $log){
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

			case "RANKED_TEAM_5x5":
			queue = "Rank 5s";
			break;

			default: 
				queue;
		};

		return {mode: mode, queue: queue};
	}

	log = function(content, info, type){
		if(info) $log.info(info);
		if(!type) $log.debug(content);
		//cases for type
		else if (type){
			switch (type) {
				case "l":
				$log.log(content);
				break;

				case "i":
				$log.info(content);
				break;

				case "w":
				$log.warn(content);
				break;

				case "e":
				$log.error(content);
				break;

				case "d":
				$log.debug(content);
				break;

				default:
					$log.debug(content);
			}
		}
	}
}])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
  
  $locationProvider.html5Mode(true);
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
.service("ItemService", function(){
	this.itemList = [];
})
.service("RuneService", function(){
	this.runeList = [];
})