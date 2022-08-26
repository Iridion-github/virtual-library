angular.module('myApp').factory('currentLocationService', ['$rootScope', function ($rootScope) {
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
}]);