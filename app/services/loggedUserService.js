angular.module('myApp').factory('loggedUserService', ['$rootScope', '$localStorage', function ($rootScope, $localStorage) {
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