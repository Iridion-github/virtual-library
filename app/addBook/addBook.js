'use strict';

angular.module('myApp.addBook', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/addBook', {
            templateUrl: 'addBook/addBook.html',
            controller: 'AddBookController',
        });
    }])
    .controller('AddBookController', [function () {

    }]);