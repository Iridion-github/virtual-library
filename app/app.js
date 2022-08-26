'use strict';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLess = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateIsbn(length) {
    let result = '';
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

function generateRandomWord() {
    return 'right';
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
    'myApp.wordle',
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

    .factory('customModalService', ['$rootScope', function ($rootScope) {
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

    .factory('wordleService', ['$rootScope', '$localStorage', function ($rootScope, $localStorage) {
        const service = {
            alphabet: charactersLess,
            getAlphabet: function () {
                return this.alphabet;
            },
            targetWord: generateRandomWord(),
            getTargetWord: function () {
                return this.targetWord;
            },
            setTargetWord: function (word) {
                this.targetWord = word;
                $rootScope.$broadcast('targetWord:updated', word);
            },
            insertedWords: [],
            getInsertedWords: function () {
                return this.insertedWords;
            }, setInsertedWords: function (updatedArr) {
                this.insertedWords = updatedArr;
                $rootScope.$broadcast('insertedWords:updated', updatedArr);
            },
            greenLetters: [],
            getGreenLetters: function () {
                return this.greenLetters;
            },
            setGreenLetters: function (updatedLetters) {
                this.greenLetters = updatedLetters;
                $rootScope.$broadcast('greenLetters:updated', updatedLetters);
            },
            yellowLetters: [],
            getYellowLetters: function () {
                return this.yellowLetters;
            },
            setYellowLetters: function (updatedLetters) {
                this.yellowLetters = updatedLetters;
                $rootScope.$broadcast('yellowLetters:updated', updatedLetters);
            },
            excludedLetters: [],
            getExcludedLetters: function () {
                return this.excludedLetters;
            },
            setExcludedLetters: function (updatedLetters) {
                this.excludedLetters = updatedLetters;
                $rootScope.$broadcast('excludedLetters:updated', updatedLetters);
            }
            ,
            currentWord: '',
            getCurrentWord: function () {
                return this.currentWord;
            },
            setCurrentWord: function (word) {
                this.currentWord = word;
                $rootScope.$broadcast('currentWord:updated', word);
            },
            isPlayable: true,
            getIsPlayable: function () {
                return this.isPlayable;
            },
            setIsPlayable: function (value) {
                this.isPlayable = value;
                $rootScope.$broadcast('isPlayable:updated', value);
            },
            resetGame: function () {
                this.setGameMessage(undefined);
                this.setIsPlayable(true);
                this.setInsertedWords([]);
                this.setYellowLetters([]);
                this.setGreenLetters([]);
                this.setExcludedLetters([]);
                this.setCurrentWord('');
                this.setTargetWord(generateRandomWord());
            },
            gameMessage: undefined,
            getGameMessage: function () {
                return this.message;
            },
            setGameMessage: function (msg) {
                this.gameMessage = msg;
                $rootScope.$broadcast('gameMessage:updated', msg);
            },
            handleVictory: function () {
                console.log('handleVictory');
                this.setGameMessage(`Congratulazioni, hai vinto! \nLa parola era: ${this.targetWord}`);
                this.setIsPlayable(false);
            },
            handleDefeat: function () {
                this.setGameMessage(`Peccato, hai perso. \nLa parola era: ${this.targetWord}`);
                this.setIsPlayable(false);
            },
            compareWords: function (currentWord) {
                this.setCurrentWord('');
                const currentLetters = currentWord.split('');
                const targetLetters = this.targetWord.split('');
                for (let x = 0; x <= 4; x++) {
                    const currLetter = currentLetters[x];
                    const targLetter = targetLetters[x];
                    //green letters logic
                    if (currLetter === targLetter && !this.greenLetters.includes(currLetter)) {
                        const greenLetterObj = {
                            index: x,
                            value: currLetter,
                        }
                        const greenLettersUpdated = [...this.greenLetters, greenLetterObj];
                        this.setGreenLetters(greenLettersUpdated);
                        $rootScope.$broadcast('greenLetters:updated', greenLettersUpdated);
                    }
                    //yellow letters logic
                    if (currLetter !== targLetter && this.targetWord.includes(currLetter) && !this.yellowLetters.includes(currLetter)) {
                        const yellowLetterObj = {
                            index: x,
                            value: currLetter,
                        }
                        const yellowLettersUpdated = [...this.yellowLetters, yellowLetterObj];
                        this.setYellowLetters(yellowLettersUpdated);
                        $rootScope.$broadcast('yellowLetters:updated', yellowLettersUpdated);
                    }
                    //red letters logic
                    if (currLetter !== targLetter && !this.targetWord.includes(currLetter) && !this.excludedLetters.includes(currLetter)) {
                        const excludedLettersUpdated = [...this.excludedLetters, currLetter];
                        this.setExcludedLetters(excludedLettersUpdated);
                        $rootScope.$broadcast('excludedLetters:updated', excludedLettersUpdated);
                    }
                }
                if (currentWord === this.targetWord) {
                    this.handleVictory();
                    return;
                }
                const insertedWordsUpdated = [...this.insertedWords, currentWord];
                this.insertedWords = insertedWordsUpdated;
                $rootScope.$broadcast('insertedWords:updated', insertedWordsUpdated);
                if (insertedWordsUpdated.length > 5) {
                    if (this.targetWord !== currentWord) {
                        this.handleDefeat();
                    }
                }
            }
        }
        $rootScope.$on("getAlphabet", service.getAlphabet);
        $rootScope.$on("getTargetWord", service.getTargetWord);
        $rootScope.$on("setTargetWord", service.setTargetWord);
        $rootScope.$on("getCurrentWord", service.getCurrentWord);
        $rootScope.$on("setCurrentWord", service.setCurrentWord);
        $rootScope.$on("getGreenLetters", service.getGreenLetters);
        $rootScope.$on("setGreenLetters", service.setGreenLetters);
        $rootScope.$on("getYellowLetters", service.getYellowLetters);
        $rootScope.$on("setYellowLetters", service.setYellowLetters);
        $rootScope.$on("getExcludedLetters", service.getExcludedLetters);
        $rootScope.$on("setExcludedLetters", service.setExcludedLetters);
        $rootScope.$on("getInsertedWords", service.getInsertedWords);
        $rootScope.$on("setInsertedWords", service.setInsertedWords);
        $rootScope.$on("compareWords", service.compareWords);
        $rootScope.$on("getIsPlayable", service.getIsPlayable);
        $rootScope.$on("setIsPlayable", service.setIsPlayable);
        $rootScope.$on("getGameMessage", service.getGameMessage);
        $rootScope.$on("setGameMessage", service.setGameMessage);
        $rootScope.$on("resetGame", service.resetGame);
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
            $scope.targetWord = wordleService.getTargetWord();

            $scope.$on('targetWord:updated', function (event, data) {
                $scope.targetWord = data;
            });

            $scope.currentWord = wordleService.getCurrentWord();

            $scope.$on('currentWord:updated', function (event, data) {
                console.log('set currentWord to:', data);
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

        }])

    .component('backToListBtn', {
        template: `<a href="#!/list" type="button" class="btn btn-secondary mr-2"><i class="fa-solid fa-arrow-left"></i> Torna alla lista</a>`,
        controller: function () {
        },
    })

    .component('customModal', {
        template: `<div class="modal d-block" role="dialog" aria-labelledby="myModalLabel">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 id="myModalLabel">{{ $ctrl.modalTitle }}</h5>
                                    <button type="button" class="close" data-dismiss="modal" ng-click="$ctrl.closeCustomModal()">×</button>
                                </div>
                                <div class="modal-body">
                                    <p>{{ $ctrl.currentMessage }}</p>
                                </div>
                                <div class="modal-footer">
                                    <button class="btn btn-secondary" data-dismiss="modal" ng-click="$ctrl.closeCustomModal()">{{ $ctrl.btnText }}</button>
                                </div>
                            </div>
                        </div>
                    </div>`,
        bindings: {
            modalTitle: '@',
            currentMessage: '@',
            closeCustomModal: '&',
            btnText: '@',
        },
        controller: function () {
        },
    })