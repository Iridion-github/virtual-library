'use strict';

angular.module('myApp.wordle', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/wordle', {
            templateUrl: 'partials/wordle.html',
            controller: 'WordleController',
        });
    }])
    .controller('WordleController', ['$scope', '$location', function ($scope, $location) {

    }]);