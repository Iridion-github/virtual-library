'use strict';

angular.module('myApp.login', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginController',
        });
    }])
    .controller('LoginController', ['$scope', '$location', function ($scope, $location) {

        $scope.savedUsers = [{
            id: 'userId',
            username: 'admin',
            password: 'admin',
            role: 'admin',
        }]

        $scope.setLoggedUser = $scope.$parent.setLoggedUser;

        $scope.unsetLoggedUser = $scope.$parent.unsetLoggedUser;

        $scope.isDisabledLoginBtn = true;

        $scope.userToLog = {
            username: undefined,
            password: undefined,
        }

        $scope.$watch('userToLog', function () {
            $scope.isDisabledLoginBtn = !$scope.userToLog.username || !$scope.userToLog.password;
        }, true);

        $scope.tryLogin = function () {
            const targetUser = $scope.savedUsers.find(u => u.username === $scope.userToLog.username);
            let correctPassword = false;
            if (targetUser) {
                correctPassword = targetUser.password === $scope.userToLog.password;
                if (correctPassword) {
                    $scope.setLoggedUser({
                        id: targetUser.id,
                        username: targetUser.username,
                        role: targetUser.role,
                    });
                    $location.path('/list');
                }
            }
            if (!targetUser || !correctPassword) {
                $scope.showCustomModal('Utente inesistente o dati errati')
            }
        }

        $scope.logout = function () {
            $scope.unsetLoggedUser();
        }
    }]);