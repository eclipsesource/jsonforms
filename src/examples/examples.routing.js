'use strict';

require('./examples.menudirective');

function examplesRouting($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.when("/examples", "/examples/person");
    $urlRouterProvider.otherwise('/examples');

    $stateProvider
        .state('examples', {
            url: '/examples',
            template: require('../../partials/examples.html'),
            controllerAs: 'vm',
            resolve: {
                loadExamplesController: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function () {
                        // load examples module and all its dependencies
                        require('./examples.module');
                        require('../listing/listing.module');
                        $ocLazyLoad.load([
                            {name: 'ui.ace'},
                            {name: 'jsonforms'},
                            {name: 'jsonforms-material'},
                            {name: 'jsonforms-examples'},
                            {name: 'listing'},
                            {name: 'listing.listingcontroller'},
                            {name: 'listing.listingdirective'},
                            {name: 'examples'},
                            {name: 'examples.arrayscontroller'},
                            {name: 'examples.asynccontroller'},
                            {name: 'examples.categoriescontroller'},
                            {name: 'examples.customcontroller'},
                            //  { name: 'examples.customcontrol' },
                            {name: 'examples.generateschemacontroller'},
                            {name: 'examples.generateuicontroller'},
                            {name: 'examples.layoutscontroller'},
                            {name: 'examples.liveeditcontroller'},
                            {name: 'examples.masterdetailcontroller'},
                            {name: 'examples.personcontroller'},
                            {name: 'examples.remoterefcontroller'},
                            {name: 'examples.rulecontroller'}]);
                        deferred.resolve();
                    });
                    return deferred.promise;
                }]
            }
        })
        .state('examples.person', {
            url: '/person',
            template: require('../../partials/examples/person.html'),
            controller: 'PersonController',
            controllerAs: 'vm'
        })
        .state('examples.async', {
            url: '/async',
            template: require('../../partials/examples/async.html'),
            controller: 'AsyncController',
            controllerAs: 'vm'
        })
        .state('examples.remote-ref', {
            url: '/remote-ref',
            template: require('../../partials/examples/remote-ref.html'),
            controller: 'RemoteRefController',
            controllerAs: 'vm'
        })
        .state('examples.arrays', {
            url: '/arrays',
            template: require('../../partials/examples/arrays.html'),
            controller: 'ArraysController',
            controllerAs: 'vm'
        })
        .state('examples.categories', {
            url: '/categories',
            template: require('../../partials/examples/categories.html'),
            controller: 'CategoriesController',
            controllerAs: 'vm'
        })
        .state('examples.masterdetail', {
            url: '/masterdetail',
            template: require('../../partials/examples/masterdetail.html'),
            controller: 'MasterDetailController',
            controllerAs: 'vm'
        })
        .state('examples.rule', {
            url: '/rule',
            template: require('../../partials/examples/rule.html'),
            controller: 'RuleController',
            controllerAs: 'vm'
        })
        .state('examples.layouts', {
            url: '/layouts',
            template: require('../../partials/examples/layouts.html'),
            controller: 'LayoutsController',
            controllerAs: 'vm'
        })
        .state('examples.live-edit', {
            url: '/live-edit',
            template: require('../../partials/examples/live-edit.html'),
            controller: 'LiveEditController',
            controllerAs: 'vm'
        })
        .state('examples.generate-ui', {
            url: '/generate-ui',
            template: require('../../partials/examples/generate-ui.html'),
            controller: 'GenerateUiSchemaController',
            controllerAs: 'vm'
        })
        .state('examples.generate-schema', {
            url: '/generate-schema',
            template: require('../../partials/examples/generate-schema.html'),
            controller: 'GenerateSchemaController',
            controllerAs: 'vm'
        })
        .state('examples.custom-control', {
            url: '/custom-control',
            template: require('../../partials/examples/custom-control.html'),
            controller: 'CustomControlController',
            controllerAs: 'vm'
        });
}

angular.module('examples.routing', ['examples.menudirective']).config(examplesRouting);