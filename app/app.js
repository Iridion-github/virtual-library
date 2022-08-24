'use strict';

// Declare app level module which depends on views, and core components
function getDefaultBooks(amount) {
    const result = [];
    for (let x = 0; x < amount; x++) {
        result.push({
            id: x.toString(),
            isbn: x.toString(),
            title: `Libro default ${x + 1}`,
            author: `Autore libro default ${x + 1}`,
            description: `Descrizione libro default ${x + 1}`,
            coverImg: 'data:image/png;base64,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',
        },)
    }
    return result;
}

function getPaginatedBooks(allBooks, booksPerPage) {
    const result = [];
    for (let i = 0; i < allBooks.length; i += booksPerPage) {
        const chunk = allBooks.slice(i, i + booksPerPage);
        result.push(chunk);
    }
    return result;
}

angular.module('myApp', [
    'ngRoute',
    'myApp.list',
    'myApp.addBook',
    'myApp.detail',
    'myApp.editBook',
    'myApp.login',
    'myApp.version'
])
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/login'});
    }])
    .controller('StoreController', ['$scope', '$location', function ($scope, $location) {
        //------------------ init ------------------
        const defaultBooks = getDefaultBooks(35)
        $scope.allBooks = [...defaultBooks];
        $scope.isDisabledAddBook = true;
        $scope.bookToAdd = {
            isbn: undefined,
            title: undefined,
            author: undefined,
            description: undefined,
            coverImg: undefined,
        };
        $scope.selectedBook = undefined;
        $scope.bookToEdit = undefined;
        $scope.bookToDelete = undefined;
        $scope.currentLocation = 'Elenco libri';
        $scope.currentPage = 1;
        $scope.totalPages = Math.ceil($scope.allBooks.length / 10);
        $scope.booksPerPage = 10;
        $scope.paginatedBooks = getPaginatedBooks($scope.allBooks, $scope.booksPerPage);
        $scope.visibleBooks = $scope.paginatedBooks[0];
        $scope.savedUsers = [{
            id: 'userId',
            username: 'admin',
            password: 'admin',
            role: 'admin',
        }]
        $scope.loggedUser = undefined;
        $scope.userToLog = {
            username: undefined,
            password: undefined,
        }
        $scope.isDisabledLoginBtn = true;

        //------------------ add ------------------
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

        //------------------ detail ------------------

        $scope.onSelectBook = function (id) {
            $scope.selectedBook = {...$scope.allBooks.find(b => b.id === id)};
        }

        $scope.unselectBook = function () {
            $scope.selectedBook = undefined;
        }

        //------------------ edit ------------------

        $scope.setBookToEdit = function (id) {
            $scope.bookToEdit = {...$scope.allBooks.find(b => b.id === id)};
        }

        $scope.editBook = function (editedBook) {
            $scope.allBooks = [...$scope.allBooks].map(b => {
                if (b.id === editedBook.id) {
                    return editedBook;
                }
                return b;
            })
            $scope.selectedBook = editedBook;
            $scope.bookToEdit = undefined;
            $location.path('/detail');
        };

        $scope.$watch('allBooks', function () {
            $scope.paginatedBooks = getPaginatedBooks($scope.allBooks, $scope.booksPerPage);
        }, true);

        $scope.$watch('allBooks', function () {
            $scope.visibleBooks = $scope.paginatedBooks[$scope.currentPage - 1];
        }, true);

        //------------------ delete ------------------

        $scope.openDeleteBookModal = function (id) {
            $scope.bookToDelete = {...$scope.allBooks.find(b => b.id === id)};
        }

        $scope.closeDeleteBookModal = function () {
            $scope.bookToDelete = undefined;
        }

        $scope.deleteBook = function (id) {
            $scope.visibleBooks = $scope.visibleBooks.filter(b => {
                return b.id !== id
            })
            $scope.bookToDelete = undefined;
            $location.path('/list');
        };

        //------------------ currentLocation ------------------

        $scope.$on('$routeChangeStart', function ($event, next, current) {
            if (next.$$route) {
                const controller = next.$$route.controller;
                switch (controller) {
                    case 'ListController':
                        return $scope.currentLocation = 'Elenco libri';
                    case 'AddBookController':
                        return $scope.currentLocation = 'Aggiunta libro';
                    case 'DetailController':
                        return $scope.currentLocation = 'Dettagli libro';
                    case 'EditBookController':
                        return $scope.currentLocation = 'Modifica libro';
                    case 'LoginController':
                        return $scope.currentLocation = 'Login';
                    default:
                        return 'Home';
                }
            }
        });

        //------------------ pagination ------------------

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

        //------------------ errors ------------------

        $scope.currentError = undefined;

        $scope.showErrorModal = function (errorMsg) {
            $scope.currentError = errorMsg;
        }

        $scope.closeErrorModal = function () {
            $scope.currentError = undefined;
        }

        //------------------ authentication ------------------

        $scope.$watch('userToLog', function () {
            $scope.isDisabledLoginBtn = !$scope.userToLog.username || !$scope.userToLog.password;
        }, true);

        $scope.tryLogin = function () {
            const targetUser = $scope.savedUsers.find(u => u.username === $scope.userToLog.username);
            if (targetUser) {
                const correctPassword = targetUser.password === $scope.userToLog.password;
                if (correctPassword) {
                    $scope.loggedUser = {
                        id: targetUser.id,
                        username: targetUser.username,
                        role: targetUser.role,
                    };
                    $location.path('/list');
                    return;
                }
            }
            $scope.showErrorModal('Utente inesistente o dati errati')
        }

        $scope.logout = function () {
            $scope.loggedUser = undefined;
        }

        $scope.isAdmin = function () {
            return !!$scope.loggedUser && $scope.loggedUser.role === 'admin'
        }

    }]);