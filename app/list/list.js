'use strict';

angular.module('myApp.list', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/list', {
            templateUrl: 'list/list.html',
            controller: 'ListController',
        });
    }])
    .controller('ListController', [function () {

    }]);