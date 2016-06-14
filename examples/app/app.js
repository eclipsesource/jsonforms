'use strict';

angular.module('makeithappen', [
    'ngRoute',
    //'ngResource',
    //'ui.ace',
    'jsonforms'
        }).when('/resolve', {
            templateUrl: 'app/resolve/resolve.html',
            controller: 'ResolveController',
            controllerAs: 'vm'
]);
