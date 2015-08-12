'use strict';
var findWithAttr = null;

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
		console.log(arr); console.log(attr); console.log(value);
		for(var i = 0; i < arr.length; i++){
			if(arr[i][attr] == value) return i;
		}
	}
}])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
  
  //$locationProvider.html5Mode(true);
}])
.service("SummonerService", function(){
	this.summoner = {};
})