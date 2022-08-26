'use strict';

angular.module('myApp.list', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/list', {
            templateUrl: 'pages/list.html',
            controller: 'ListController',
        });
    }])
    .controller('ListController', ['$scope', function ($scope) {
        $scope.isAdmin = $scope.$parent.isAdmin;
        $scope.allBooks = $scope.$parent.allBooks;
        $scope.currentPage = 1;
        $scope.totalPages = Math.ceil($scope.allBooks.length / 10);
        $scope.booksPerPage = 10;
        $scope.paginatedBooks = getPaginatedBooks($scope.allBooks, $scope.booksPerPage);
        $scope.visibleBooks = $scope.paginatedBooks[0];

        $scope.disabledPrevPage = $scope.currentPage < 2;

        $scope.disabledNextPage = $scope.currentPage >= $scope.totalPages - 1;

        $scope.goPrevPage = function () {
            $scope.currentPage = $scope.currentPage - 1;
        }

        $scope.goNextPage = function () {
            $scope.currentPage = $scope.currentPage + 1;
        }

        $scope.$watch('currentPage', function () {
            $scope.visibleBooks = $scope.paginatedBooks[$scope.currentPage - 1];
            $scope.disabledPrevPage = $scope.currentPage < 2;
            $scope.disabledNextPage = $scope.currentPage > $scope.totalPages - 1;
        }, true);

        $scope.selectedBook = $scope.$parent.selectedBook;

        $scope.setSelectedBook = $scope.$parent.setSelectedBook;

        $scope.onSelectBook = function (id) {
            const targetBook = {...$scope.allBooks.find(b => b.id === id)};
            $scope.setSelectedBook(targetBook);
        }
    }]);