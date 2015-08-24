'use strict';

angular.module('makeithappen', [
    'ngRoute',
    'ngResource',
    'jsonForms',
    'ui.ace'
]).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/local', {
            templateUrl: 'templates/local.html',
            controller: 'LocalController'
        });
        $routeProvider.when('/remote', {
            templateUrl: 'templates/remote.html',
            controller: 'RemoteController'
        });
        $routeProvider.when('/editor', {
            templateUrl: 'templates/editor.html',
            controller: 'EditorController'
        });
        $routeProvider.when('/async', {
            templateUrl: 'templates/async.html',
            controller: 'AsyncController'
        });
        $routeProvider.when('/custom', {
            templateUrl: 'templates/custom.html',
            controller: 'MyController'
        });
        $routeProvider.when('/defaultui', {
            templateUrl: 'templates/defaultui.html',
            controller: 'DefaultUISchemaController'
        });
        $routeProvider.when('/demo', {
            templateUrl: 'templates/demo.html',
            controller: 'DemoController'
        });
        $routeProvider.otherwise({
            redirectTo: '/local'
        });    }
]);