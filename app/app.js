'use strict';

function generateIsbn(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            characters.length));
    }
    return result;
}

function getDefaultBooks(amount) {
    const result = [];
    for (let x = 0; x < amount; x++) {
        result.push({
            id: x.toString(),
            isbn: generateIsbn(12),
            title: `Titolo libro default ${x + 1}`,
            author: `Autore libro default ${x + 1}`,
            description: `Descrizione libro default ${x + 1}`,
            coverImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbmpkg-KZ4ezscypPhu3nnrNHwP4WYlTJEkQ&usqp=CAU',
        });
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
    'swxLocalStorage',
    'myApp.list',
    'myApp.addBook',
    'myApp.detail',
    'myApp.editBook',
    'myApp.login',
    'myApp.version',
])

    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/list'});
    }])

    .factory('currentLocationService', ['$rootScope', function ($rootScope) {
        const service = {
            currentLocation: 'Default',
            getCurrentLocation: function () {
                return this.currentLocation;
            },
            setCurrentLocation: function (newLocation) {
                this.currentLocation = newLocation;
                $rootScope.$broadcast('currentLocation:updated', newLocation);
            },
        }
        $rootScope.$on("getCurrentLocation", service.getCurrentLocation);
        $rootScope.$on("setCurrentLocation", service.setCurrentLocation);
        return service;
    }])

    .factory('loggedUserService', ['$rootScope', '$localStorage', function ($rootScope, $localStorage) {
        const service = {
            loggedUser: {
                id: '',
                username: '',
                role: '',
            },
            getLoggedUser: function () {
                const userInStorageStr = $localStorage.get('loggedUser');
                const userInStorage = !userInStorageStr ? undefined : JSON.parse(userInStorageStr);
                if (userInStorage && userInStorage.id && (!this.loggedUser || !this.loggedUser.id)) {
                    this.loggedUser = userInStorage;
                    return userInStorage;
                } else {
                    return this.loggedUser;
                }
            },
            setLoggedUser: function (newUser) {
                this.loggedUser = newUser;
                if (!newUser) {
                    $localStorage.remove('loggedUser');
                } else {
                    $localStorage.put('loggedUser', JSON.stringify(newUser), 3);
                }
                $rootScope.$broadcast('loggedUser:updated', newUser);
            },
            isLoggedIn: function () {
                return !!(this.loggedUser && !!this.loggedUser.username);
            },
            isAdmin: function () {
                return this.isLoggedIn() && this.loggedUser.role === 'admin';
            },
        }
        $rootScope.$on("getLoggedUser", service.getLoggedUser);
        $rootScope.$on("setLoggedUser", service.setLoggedUser);
        $rootScope.$on("isLoggedIn", service.isLoggedIn);
        $rootScope.$on("isAdmin", service.isAdmin);
        return service;
    }])

    .factory('errorModalService', ['$rootScope', function ($rootScope) {
        const service = {
            error: undefined,
            getError: function () {
                return this.error;
            },
            setError: function (newError) {
                this.error = newError;
                $rootScope.$broadcast('error:updated', newError);
            },
        }
        $rootScope.$on("getError", service.getError);
        $rootScope.$on("setError", service.setError);
        return service;
    }])

    .factory('booksService', ['$rootScope', function ($rootScope) {
        const service = {
            allBooks: getDefaultBooks(35),
            getAllBooks: function () {
                return this.allBooks;
            },
            selectedBook: undefined,
            getSelectedBook: function () {
                return this.selectedBook;
            },
            setSelectedBook: function (newBook) {
                this.selectedBook = newBook;
                $rootScope.$broadcast('selectedBook:updated', newBook);
            },
            bookToEdit: undefined,
            getBookToEdit: function () {
                return this.bookToEdit;
            },
            setBookToEdit: function (id) {
                const newBook = {...this.allBooks.find(b => b.id === id)}
                this.bookToEdit = newBook;
                $rootScope.$broadcast('bookToEdit:updated', newBook);
            },
            editBook: function (editedBook) {
                const updatedAllBooks = [...this.allBooks].map(b => {
                    if (b.id === editedBook.id) {
                        return editedBook;
                    }
                    return b;
                });
                this.allBooks = updatedAllBooks;
                this.selectedBook = editedBook;
                $rootScope.$broadcast('selectedBook:updated', editedBook);
                $rootScope.$broadcast('allBooks:updated', updatedAllBooks);
            },
            deleteBook: function (id) {
                const updatedAllBooks = this.allBooks.filter(b => {
                    return b.id !== id
                });
                this.allBooks = updatedAllBooks;
                $rootScope.$broadcast('allBooks:updated', updatedAllBooks);
            }
        }
        $rootScope.$on("getAllBooks", service.getAllBooks);
        $rootScope.$on("getSelectedBook", service.getSelectedBook);
        $rootScope.$on("setSelectedBook", service.setSelectedBook);
        $rootScope.$on("getBookToEdit", service.getBookToEdit);
        $rootScope.$on("setBookToEdit", service.setBookToEdit);
        $rootScope.$on("editBook", service.editBook);
        $rootScope.$on("deleteBook", service.deleteBook);
        return service;
    }])


    .run([
        '$rootScope',
        '$location',
        'loggedUserService',
        'currentLocationService',
        'booksService',
        function (
            $rootScope,
            $location,
            loggedUserService,
            currentLocationService,
            booksService
        ) {
            $rootScope.$on('$routeChangeStart', function (event, next) {
                const currentController = next.$$route.controller;
                const isAdmin = loggedUserService.isAdmin();
                const selectedBook = booksService.getSelectedBook();
                const bookToEdit = booksService.getBookToEdit();
                switch (currentController) {
                    case 'ListController':
                        currentLocationService.setCurrentLocation('Elenco libri');
                        return;
                    case 'AddBookController':
                        currentLocationService.setCurrentLocation('Aggiunta libro');
                        //requires to be admin
                        if (!isAdmin) {
                            $location.path('/list')
                        }
                        return;
                    case 'DetailController':
                        currentLocationService.setCurrentLocation('Dettagli libro');
                        //a book must be selected
                        if (!selectedBook || !selectedBook.isbn) {
                            $location.path('/list');
                        }
                        return;
                    case 'EditBookController':
                        currentLocationService.setCurrentLocation('Modifica libro');
                        //requires to be admin
                        if (!isAdmin) {
                            $location.path('/list')
                        }
                        //a book must be in edit mode
                        if (!bookToEdit.isbn) {
                            $location.path('/list');
                        }
                        return;
                    case 'LoginController':
                        currentLocationService.setCurrentLocation('Login');
                        //must not be already logged in
                        const alreadyLoggedIn = loggedUserService.isLoggedIn()
                        if (alreadyLoggedIn) {
                            event.preventDefault();
                            $location.path('/list')
                        }
                        return;
                    default:
                        currentLocationService.setCurrentLocation('Home');
                        return;
                }
            });
        }])

    .controller('StoreController', [
        '$scope',
        'loggedUserService',
        'currentLocationService',
        'errorModalService',
        'booksService',
        function (
            $scope,
            loggedUserService,
            currentLocationService,
            errorModalService,
            booksService
        ) {
            //------------------ breadcrumbs ------------------
            $scope.currentLocation = currentLocationService.getCurrentLocation();

            $scope.$on('currentLocation:updated', function (event, data) {
                $scope.currentLocation = data;
            });

            //------------------ error modal ------------------
            $scope.currentError = errorModalService.getError();

            $scope.$on('error:updated', function (event, data) {
                $scope.currentError = data;
            });

            $scope.showErrorModal = function (errorMsg) {
                errorModalService.setError(errorMsg);
            }

            $scope.closeErrorModal = function () {
                errorModalService.setError(undefined);
            }

            //------------------ logged user ------------------
            $scope.loggedUser = loggedUserService.getLoggedUser();

            $scope.$on('loggedUser:updated', function (event, data) {
                $scope.loggedUser = data;
            });

            $scope.setLoggedUser = function (newUser) {
                loggedUserService.setLoggedUser(newUser);
            }

            $scope.unsetLoggedUser = function () {
                loggedUserService.setLoggedUser(undefined);
            }

            $scope.isAdmin = function () {
                return loggedUserService.isAdmin();
            }

            //------------------ books ------------------
            $scope.allBooks = booksService.getAllBooks();

            $scope.$on('allBooks:updated', function (event, data) {
                $scope.allBooks = data;
            });

            $scope.selectedBook = booksService.getSelectedBook();

            $scope.$on('selectedBook:updated', function (event, data) {
                $scope.selectedBook = data;
            });

            $scope.setSelectedBook = function (newBook) {
                booksService.setSelectedBook(newBook);
            }

            $scope.bookToEdit = booksService.getBookToEdit();

            $scope.$on('bookToEdit:updated', function (event, data) {
                $scope.bookToEdit = data;
            });

            $scope.setBookToEdit = function (id) {
                booksService.setBookToEdit(id);
            }

            $scope.editBook = function (editedBook) {
                booksService.editBook(editedBook);
            }

            $scope.deleteBook = function (id) {
                booksService.deleteBook(id);
            };

        }])

    .component('backToListBtn', {
        template: `<a href="#!/list" type="button" class="btn btn-secondary mr-2"><i class="fa-solid fa-arrow-left"></i> Torna alla lista</a>`,
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