'use strict';

angular.module('myApp.detail', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/detail', {
            templateUrl: 'partials/detail.html',
            controller: 'DetailController',
        });
    }])
    .controller('DetailController', ['$scope', '$location', function ($scope, $location) {

        $scope.selectedBook = $scope.$parent.selectedBook;

        $scope.bookToDelete = undefined;

        $scope.allBooks = $scope.$parent.allBooks;

        $scope.openDeleteBookModal = function (id) {
            $scope.bookToDelete = {...$scope.allBooks.find(b => b.id === id)};
        }

        $scope.closeDeleteBookModal = function () {
            $scope.bookToDelete = undefined;
        }

        $scope.deleteBook = $scope.$parent.deleteBook;

        $scope.handleDeleteBook = function (id) {
            $scope.deleteBook(id);
            $scope.bookToDelete = undefined;
            $location.path('/list');
        }

    }]);