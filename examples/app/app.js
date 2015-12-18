'use strict';

angular.module('makeithappen', [
    'ngRoute',
    'ngResource',
    'ui.ace',
    'jsonforms'
]).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/local', {
            templateUrl: 'app/local/local.html',
            controller: 'LocalController',
            controllerAs: 'vm'
        });
        $routeProvider.when('/editor', {
            templateUrl: 'app/editor/editor.html',
            controller: 'EditorController',
            controllerAs: 'vm'
        });
        $routeProvider.when('/custom', {
            templateUrl: 'app/custom/custom.html',
            controller: 'CustomController',
            controllerAs: 'vm'
        });
        $routeProvider.when('/defaultui', {
            templateUrl: 'app/default-ui/defaultui.html',
            controller: 'DefaultUISchemaController',
            controllerAs: 'vm'
        });
        $routeProvider.when('/defaultschema', {
            templateUrl: 'app/default/default-schema.html',
            controller: 'DefaultSchemaController',
            controllerAs: 'vm'
        });
        $routeProvider.when('/placeholder-posts/:id?', {
            templateUrl: 'app/placeholder/placeholder-posts.html',
            controller: 'PlaceholderController',
            controllerAs: 'vm'
        });
        $routeProvider.when('/placeholder-users/:id?', {
            templateUrl: 'app/placeholder/placeholder-users.html',
            controller: 'PlaceholderController',
            controllerAs: 'vm'
        });
        $routeProvider.when('/placeholder-comments/:id?', {
            templateUrl: 'app/placeholder/placeholder-comments.html',
            controller: 'PlaceholderController',
            controllerAs: 'vm'
        });
        $routeProvider.when('/polymer', {
            templateUrl: 'app/polymer/polymer.html',
            controller: 'PolymerController',
            controllerAs: 'vm'
        });
        $routeProvider.otherwise({
            redirectTo: '/local'
        });
    }
]);