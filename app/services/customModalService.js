angular.module('myApp').factory('customModalService', ['$rootScope', function ($rootScope) {
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