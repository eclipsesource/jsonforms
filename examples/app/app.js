'use strict';

angular.module('makeithappen', [
    'ngRoute',
    'jsonforms'
        }).when('/resolve', {
            templateUrl: 'app/resolve/resolve.html',
            controller: 'ResolveController',
            controllerAs: 'vm'
]);
