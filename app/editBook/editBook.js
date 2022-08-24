'use strict';

angular.module('myApp.editBook', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/editBook', {
            templateUrl: 'editBook/editBook.html',
            controller: 'EditBookController',
        });
    }])
    .controller('EditBookController', [function () {
    }]);