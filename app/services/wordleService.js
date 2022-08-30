angular.module('myApp').factory('wordleService', ['$rootScope', '$http', function ($rootScope, $http) {
    const service = {
        alphabet: charactersLess,
        getAlphabet: function () {
            return this.alphabet;
        },
        numberOfTries: gameConfig.numberOfTries,
        hardMode: gameConfig.hardMode,
        getHardMode: function (){
            return this.hardMode;
        },
        setHardMode: function (value){
            this.hardMode = value
            $rootScope.$broadcast('hardMode:updated', value);
        },
        getNumberOfTries: function () {
            return this.numberOfTries;
        },
        generateTargetWord: function (originalThis) {
            $http({
                method: 'GET',
                url: 'https://random-word-api.herokuapp.com/word?length=5'
            }).then(function successCallback(response) {
                originalThis.setTargetWord(response.data[0]);
            }, function errorCallback(response) {
                $rootScope.$broadcast('error:updated', 'Qualcosa è andato storto durante la generazione della parola');
            });
        },
        targetWord: undefined,
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
        currentWord: {value: ''},
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
            this.setCurrentWord({value: ''});
            this.generateTargetWord(this);
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
            this.setGameMessage(`Congratulazioni, hai vinto! \nLa parola era: ${this.targetWord}`);
            this.setIsPlayable(false);
        },
        handleDefeat: function () {
            this.setGameMessage(`Peccato, hai perso. \nLa parola era: ${this.targetWord}`);
            this.setIsPlayable(false);
        },
        compareWords: function (currentWord) {
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
            //check if game won
            if (currentWord === this.targetWord.value) {
                this.handleVictory();
                return;
            }
            const insertedWordsUpdated = [...this.insertedWords, currentWord];
            this.insertedWords = insertedWordsUpdated;
            $rootScope.$broadcast('insertedWords:updated', insertedWordsUpdated);
            //check if game lost
            if (insertedWordsUpdated.length > this.numberOfTries - 1) {
                if (this.targetWord !== currentWord) {
                    this.handleDefeat();
                }
            }
            this.setCurrentWord({value: ''});
        },
        wordIsNonexistent: true,
        getWordIsNonexistent: function () {
            return this.wordIsNonexistent;
        },
        lastCheckedWord: '',
        getLastCheckedWord: function () {
            return this.lastCheckedWord;
        },
        setLastCheckedWord: function (value) {
            this.lastCheckedWord = value;
            $rootScope.$broadcast('lastCheckedWord:updated', value);
        },
        isWordValid: false,
        getIsWordValid: function () {
            return this.isWordValid;
        },
        setIsWordValid: function (value) {
            this.isWordValid = value;
            $rootScope.$broadcast('isWordValid:updated', value);
        },
        checkIsWordValid: function (word) {
            if (!word) return this.setIsWordValid(false);
            if (word.length !== 5) return this.setIsWordValid(false);
            if (!this.isPlayable) return this.setIsWordValid(false);
            if (this.insertedWords.includes(word)) return this.setIsWordValid(false);
            if (word.length === 5 && this.lastCheckedWord !== word && this.lastCheckedWord !== word) {
                if(this.hardMode) {
                    this.setLastCheckedWord(word);
                    const originalThis = this;
                    $http({
                        method: 'GET',
                        url: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
                    }).then(function successCallback(response) {
                        originalThis.setIsWordValid(true);
                    }, function errorCallback(response) {
                        originalThis.setIsWordValid(false);
                    });
                } else {
                    this.setIsWordValid(true);
                }
            }
        },
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
    $rootScope.$on("getWordIsNonexistent", service.getWordIsNonexistent);
    $rootScope.$on("getLastCheckedWord", service.getLastCheckedWord);
    $rootScope.$on("setLastCheckedWord", service.setLastCheckedWord);
    $rootScope.$on("getIsWordValid", service.getIsWordValid);
    $rootScope.$on("setIsWordValid", service.setIsWordValid);
    $rootScope.$on("checkIsWordValid", service.isWordValid);
    $rootScope.$on("getNumberOfTries", service.getNumberOfTries);
    $rootScope.$on("getHardMode", service.getHardMode);
    $rootScope.$on("setHardMode", service.setHardMode);
    return service;
}])