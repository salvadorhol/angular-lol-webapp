'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', '$interval', function($scope, $interval) {
	var name = "Sal Holguin";
	$scope.name = "Sal Holguin";

	$interval(function(){

	}, 1000);

}]);