'use strict';

angular.module('jsonForms', [
    'ngRoute',
    'ui.bootstrap',
    'ui.validate',
    'ui.grid',
    'ui.grid.paging',
    'ui.grid.autoResize',
    'jsonForms.controllers',
    'jsonForms.utilityServices',
    'jsonForms.dataServices',
    'jsonForms.directives',
    'underscore'
]).
config(['$routeProvider',
    function($routeProvider) {

        $routeProvider.when('/:type', {
            templateUrl: '/table.html',
            controller: 'FormCtrl'
        });

        $routeProvider.when('/:type/:id', {
            templateUrl: '/form.html',
            controller: 'FormCtrl'
        });
        
        $routeProvider.otherwise({
            redirectTo: '/:type'
        });
    }
]);
