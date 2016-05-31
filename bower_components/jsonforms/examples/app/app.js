'use strict';

angular.module('makeithappen', [
    'ngRoute',
    //'ngResource',
    //'ui.ace',
    'jsonforms'
]).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/person', {
            templateUrl: 'app/person/person.html',
            controller: 'PersonController',
            controllerAs: 'vm'
        }).when('/editor', {
            templateUrl: 'app/editor/editor.html',
            controller: 'EditorController',
            controllerAs: 'vm'
        }).when('/custom', {
            templateUrl: 'app/custom/custom.html',
            controller: 'CustomController',
            controllerAs: 'vm'
        }).when('/defaultui', {
            templateUrl: 'app/default-ui/defaultui.html',
            controller: 'DefaultUISchemaController',
            controllerAs: 'vm'
        }).when('/defaultschema', {
            templateUrl: 'app/default/default-schema.html',
            controller: 'DefaultSchemaController',
            controllerAs: 'vm'
        }).when('/placeholder-posts/:id?', {
            templateUrl: 'app/placeholder/placeholder-posts.html',
            controller: 'PlaceholderController',
            controllerAs: 'vm'
        }).when('/placeholder-users/:id?', {
            templateUrl: 'app/placeholder/placeholder-users.html',
            controller: 'PlaceholderController',
            controllerAs: 'vm'
        }).when('/placeholder-comments/:id?', {
            templateUrl: 'app/placeholder/placeholder-comments.html',
            controller: 'PlaceholderController',
            controllerAs: 'vm'
        }).when('/polymer', {
            templateUrl: 'app/polymer/polymer.html',
            controller: 'PolymerController',
            controllerAs: 'vm'
        }).when('/arrays', {
            templateUrl: 'app/arrays/arrays.html',
            controller: 'ArraysController',
            controllerAs: 'vm'
        }).otherwise({
            redirectTo: '/person'
        });
    }
]);