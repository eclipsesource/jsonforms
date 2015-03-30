'use strict';

angular.module('jsonForms', [
    'ngRoute',
    'ui.bootstrap',
    'ui.validate',
    'ui.router',
    'ui.grid',
    //'ui.grid.paging',
    'ui.grid.pagination',
    'ui.grid.autoResize',
    'jsonForms.data.common',
    //'jsonForms.data.local',
    'jsonForms.data.endpoint',
    'jsonForms.data.remote',
    'jsonForms.data.send',
    'jsonForms.renderService',
    'jsonForms.bindingService',
    'jsonForms.verticalLayout',
    'jsonForms.horizontalLayout',
    'jsonForms.label',
    'jsonForms.control',
    'jsonForms.table',
    'jsonForms.controllers',
    'jsonForms.utilityServices',
    'jsonForms.dataServices',
    'jsonForms.directives'
    //'underscore'
    ]).
    config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/localdemo', {
                templateUrl: 'localform.html',
                controller: 'FormCtrlLocal'
            });

            $routeProvider.when('/rest-demo', {
                templateUrl: 'serverform.html',
                controller: 'FormCtrl'
            });

            $routeProvider.when('/:type', {
                templateUrl: 'table.html',
                controller: 'FormCtrl'
            });

            $routeProvider.when('/:type/:id', {
                templateUrl: 'form.html',
                controller: 'FormCtrl'
            });
            $routeProvider.otherwise({
                redirectTo: '/localdemo'
            });
        }
    ]);

