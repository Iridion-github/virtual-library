'use strict';

const letters = Array.from(Array(26)).map((e, i) => i + 65).map((x) => String.fromCharCode(x));

function getDefaultBooks(amount) {
    const result = [];
    for (let x = 0; x < amount; x++) {
        result.push({
            id: x.toString(),
            isbn: `${letters[x]}${letters[x]}${letters[x]}${letters[x]}${letters[x]}${letters[x]}-${x}`,
            title: `Titolo libro default ${x + 1}`,
            author: `Autore libro default ${x + 1}`,
            description: `Descrizione libro default ${x + 1}`,
            coverImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbmpkg-KZ4ezscypPhu3nnrNHwP4WYlTJEkQ&usqp=CAU',
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
        $scope.currentController = 'StoreController';

        //------------------ breadcrumbs ------------------

        $scope.currentLocation = 'Elenco libri';

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

        //------------------ error modal ------------------

        $scope.currentError = undefined;

        $scope.showErrorModal = function (errorMsg) {
            $scope.currentError = errorMsg;
        }

        $scope.closeErrorModal = function () {
            $scope.currentError = undefined;
        }

        //------------------ logged user ------------------

        $scope.loggedUser = undefined;

        $scope.setLoggedUser = function (newUser) {
            $scope.loggedUser = newUser;
        }

        $scope.unsetLoggedUser = function () {
            $scope.loggedUser = undefined;
        }

        $scope.isAdmin = function () {
            return !!$scope.loggedUser && $scope.loggedUser.role === 'admin'
        }

        //------------------ books ------------------

        $scope.allBooks = getDefaultBooks(35);

        $scope.selectedBook = undefined;

        $scope.setSelectedBook = function (newBook) {
            $scope.selectedBook = newBook;
        }

        $scope.unsetSelectedBook = function () {
            $scope.selectedBook = undefined;
        }

        $scope.bookToEdit = undefined;

        $scope.setBookToEdit = function (id) {
            $scope.bookToEdit = {...$scope.allBooks.find(b => b.id === id)};
        }

        $scope.unsetBookToEdit = function () {
            $scope.bookToEdit = undefined;
        }

        $scope.editBook = function (editedBook) {
            $scope.allBooks = [...$scope.allBooks].map(b => {
                if (b.id === editedBook.id) {
                    return editedBook;
                }
                return b;
            })
            $scope.selectedBook = editedBook;
        }

        $scope.deleteBook = function (id) {
            $scope.allBooks = $scope.allBooks.filter(b => {
                return b.id !== id
            })
        };

    }])
    .component('backToListBtn', {
        template: `<a href="#!/list" type="button" class="btn btn-secondary mr-2">Torna alla lista</a>`,
        controller: function () {
        },
    })
    .component('errorModal', {
        template: `<div class="modal d-block" role="dialog" aria-labelledby="myModalLabel">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 id="myModalLabel">Errore</h5>
                                    <button type="button" class="close" data-dismiss="modal" ng-click="$ctrl.closeErrorModal()">×</button>
                                </div>
                                <div class="modal-body">
                                    <p>{{ $ctrl.currentError }}</p>
                                </div>
                                <div class="modal-footer">
                                    <button class="btn btn-secondary" data-dismiss="modal" ng-click="$ctrl.closeErrorModal()">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>`,
        bindings: {
            currentError: '@',
            closeErrorModal: '&',
        },
        controller: function () {
        },
    })