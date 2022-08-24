'use strict';

angular.module('myApp.addBook', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/addBook', {
            templateUrl: 'addBook/addBook.html',
            controller: 'AddBookController',
        });
    }])
    .controller('AddBookController', ['$scope', '$location', function ($scope, $location) {

        $scope.currentController = 'AddBookController';

        $scope.isDisabledAddBook = true;

        $scope.bookToAdd = {
            isbn: undefined,
            title: undefined,
            author: undefined,
            description: undefined,
            coverImg: undefined,
        };

        $scope.allBooks = $scope.$parent.allBooks;

        $scope.addBook = function (newBook) {
            $scope.allBooks.push({...newBook, id: Date.now()});
            $scope.bookToAdd = undefined;
            $location.path('/list');
        };

        $scope.$watch('bookToAdd', function () {
            $scope.isDisabledAddBook = !($scope.bookToAdd.isbn && $scope.bookToAdd.isbn.length &&
                $scope.bookToAdd.title && $scope.bookToAdd.title.length &&
                $scope.bookToAdd.author && $scope.bookToAdd.author.length);
        }, true);
    }]);