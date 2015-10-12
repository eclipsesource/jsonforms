'use strict';

angular.module('jsonforms-website', [
    'ngRoute',
    'ui.bootstrap',
    'ui.validate',
    'ui.ace',
    'ui.grid',
    'ui.grid.pagination',
    'ui.grid.autoResize',
    'jsonforms'
]).
    config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/localdemo', {
                templateUrl: 'demo.html',
                controller: 'DemoController'
            });
            /*
                $routeProvider.when('/rest-demo', {
                    templateUrl: 'serverform.html',
                    controller: 'FormCtrl'
                });
            */
            $routeProvider.when('/support', {
                templateUrl: 'support.html',
                controller: 'SupportCtrl'
            });
            $routeProvider.otherwise({
                redirectTo: '/localdemo'
            });
        }
    ]);
