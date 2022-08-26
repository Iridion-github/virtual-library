'use strict';

angular.module('myApp', [
    'ngRoute',
    'swxLocalStorage',
    'myApp.list',
    'myApp.addBook',
    'myApp.detail',
    'myApp.editBook',
    'myApp.login',
    'myApp.version',
    'myApp.wordle',
])
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/list'});
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
                    case 'WordleController':
                        currentLocationService.setCurrentLocation('Wordle');
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
        'customModalService',
        'booksService',
        'wordleService',
        function (
            $scope,
            loggedUserService,
            currentLocationService,
            customModalService,
            booksService,
            wordleService
        ) {
            //------------------ breadcrumbs ------------------
            $scope.currentLocation = currentLocationService.getCurrentLocation();
            $scope.$on('currentLocation:updated', function (event, data) {
                $scope.currentLocation = data;
            });

            //------------------ error modal ------------------
            $scope.currentError = customModalService.getError();
            $scope.$on('error:updated', function (event, data) {
                $scope.currentError = data;
            });

            $scope.showCustomModal = function (errorMsg) {
                customModalService.setError(errorMsg);
            }

            $scope.closeCustomModal = function () {
                customModalService.setError(undefined);
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

            //------------------ wordle ------------------
            wordleService.resetGame();

            $scope.targetWord = wordleService.getTargetWord();
            $scope.$on('targetWord:updated', function (event, data) {
                $scope.targetWord = data;
            });

            $scope.currentWord = wordleService.getCurrentWord();
            $scope.$on('currentWord:updated', function (event, data) {
                $scope.currentWord = data;
            });

            $scope.alphabet = wordleService.getAlphabet();

            $scope.greenLetters = wordleService.getGreenLetters();
            $scope.$on('greenLetters:updated', function (event, data) {
                $scope.greenLetters = data;
            });

            $scope.yellowLetters = wordleService.getYellowLetters();
            $scope.$on('yellowLetters:updated', function (event, data) {
                $scope.yellowLetters = data;
            });

            $scope.excludedLetters = wordleService.getExcludedLetters();
            $scope.$on('excludedLetters:updated', function (event, data) {
                $scope.excludedLetters = data;
            });

            $scope.submitWord = function (word) {
                wordleService.compareWords(word);
            };

            $scope.isDisabledSubmitWord = function (word) {
                const wrongLength = word.length !== 5;
                const gameOver = !$scope.isPlayable;
                const isDuplicate = $scope.insertedWords.includes(word);
                return wrongLength || gameOver || isDuplicate;
            }

            $scope.insertedWords = wordleService.getInsertedWords();
            $scope.$on('insertedWords:updated', function (event, data) {
                $scope.insertedWords = data;
            });

            $scope.getLetterBackgroundColor = function (letter, index) {
                const isGreen = !!$scope.greenLetters.find(el => el.value === letter.toLowerCase() && el.index === index);
                const isYellow = !!$scope.yellowLetters.find(el => el.value === letter.toLowerCase() && el.index === index);
                if (isGreen) return 'bg-success';
                if (isYellow) return 'bg-warning';
                return '';
            }

            $scope.gameMessage = wordleService.getGameMessage();
            $scope.$on('gameMessage:updated', function (event, data) {
                $scope.gameMessage = data;
            });

            $scope.resetGame = function () {
                wordleService.resetGame();
            }

            $scope.isPlayable = wordleService.getIsPlayable();
            $scope.$on('isPlayable:updated', function (event, data) {
                $scope.isPlayable = data;
            });

        }]);