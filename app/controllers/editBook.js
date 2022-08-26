'use strict';

angular.module('myApp.editBook', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/editBook', {
            templateUrl: 'pages/editBook.html',
            controller: 'EditBookController',
        });
    }])
    .controller('EditBookController', ['$scope', '$location', function ($scope, $location) {

        $scope.bookToEdit = $scope.$parent.bookToEdit;

        $scope.parentAllBooks = $scope.$parent.allBooks;

        $scope.editBook = $scope.$parent.editBook;

        $scope.handleEditBook = function (editedBook) {
            $scope.editBook(editedBook);
            $scope.bookToEdit = undefined;
            $location.path('/detail');
        };

        $scope.$watch('allBooks', function () {
            $scope.paginatedBooks = getPaginatedBooks($scope.allBooks, $scope.booksPerPage);
        }, true);

        $scope.$watch('allBooks', function () {
            $scope.visibleBooks = $scope.paginatedBooks[$scope.currentPage - 1];
        }, true);
    }]);