'use strict';

angular.module('jsonForms', [
    'ngRoute',
    'ui.bootstrap',
    'ui.validate',
    'ui.router',
    'ui.ace',
    'ui.grid',
    'ui.grid.pagination',
    'ui.grid.autoResize',
    'jsonForms.services',
    'jsonForms.data.remote',
    'jsonForms.data.send',
    'jsonForms.verticalLayout',
    'jsonForms.horizontalLayout',
    'jsonForms.label',
    'jsonForms.control',
    'jsonForms.table',
    'jsonForms.controllers',
    'jsonForms.utilityServices',
    'jsonForms.dataServices',
    'jsonForms.directives'
]).
    config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/localdemo', {
                templateUrl: 'demo.html',
                controller: 'FormCtrlLocal'
            });

                $routeProvider.when('/rest-demo', {
                    templateUrl: 'serverform.html',
                    controller: 'FormCtrl'
                });

            $routeProvider.when('/support', {
                templateUrl: 'support.html',
                controller: 'SupportCtrl'
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
    ]).run(['EndpointMapping', function(EndpointMapping) {
        var testUrl = "http://localhost:9000/";
        console.log(JSON.stringify(EndpointMapping));
        EndpointMapping.register("user",  {
            single: "user/",
            many: "user",
            "size": testUrl + "user/count",
            "pagination": {
                url: testUrl + "user/search",
                paramNames: {
                    pageNr: "page",
                    pageSize: "pageSize"
                },
                // TODO: these should be put somewhere else
                defaultPageSize: 5,
                defaultPage: 1,
                defaultPageSizes: [5, 10]
            },
            "filtering": {
                url: testUrl + "user/search" //?userId={{id}}"
            }
        });
        EndpointMapping.register("task", {
            "single": "task/",
            "many": testUrl + "task",
            "pagination": {
                url: testUrl + "task/search?userId={{id}}", // TODO: userId
                paramNames: {
                    pageNr: "page",
                    pageSize: "pageSize"
                },
                defaultPageSize: 5,
                defaultPage: 1,
                defaultPageSizes: [5, 10]
            }
        });
    }]);

