'use strict';

angular.module('qbForms', [
    'ngRoute',
    'ui.bootstrap',
    'ui.validate',
    'ui.grid',
    'ui.grid.paging',
    'ui.grid.autoResize',
    'qbForms.controllers',
    'qbForms.utilityServices',
    'qbForms.dataServices',
    'qbForms.directives',
    'underscore'
]).
config(['$routeProvider',
    function($routeProvider) {

        $routeProvider.when('/localdemo', {
            templateUrl: 'localform.html',
            controller: 'FormCtrlLocal'
        });

        $routeProvider.when('/:type', {
            templateUrl: '/table.html',
            controller: 'FormCtrl'
        });

        $routeProvider.when('/:type/:id', {
            templateUrl: '/form.html',
            controller: 'FormCtrl'
        });
        
        $routeProvider.otherwise({
            redirectTo: '/localdemo'
        });
    }
]);
