'use strict';

require('./docs.menudirective');

function docsRouting($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.when("/docs", "/docs/landing");
    $urlRouterProvider.otherwise('/docs');

    $stateProvider
        .state('docs', {
            url: '/docs',
            template: require('../../partials/docs.html'),
            controllerAs: 'vm',
            resolve: {
                loadExamplesController: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function () {
                        // load examples module and all its dependencies
                        require('./docs.module');
                        require('../listing/listing.module');
                        $ocLazyLoad.load([
                            {name: 'jsonforms'},
                            {name: 'jsonforms-material'},
                            {name: 'listing'},
                            {name: 'listing.listingcontroller'},
                            {name: 'listing.listingdirective'},
                            {name: 'docs'},
                            {name: 'docs.uischemacontroller'}]);
                        deferred.resolve();
                    });
                    return deferred.promise;
                }]
            }
        })
        .state('docs.landing', {
            url: '/landing',
            template: require('../../partials/docs/landing.html')
        })
        .state('docs.introduction', {
            url: '/introduction',
            template: require('../../_site/partials/docs/introduction.html')
        })
        .state('docs.quickstart', {
            url: '/quickstart',
            template: require('../../_site/partials/docs/quickstart.html')
        })
        .state('docs.jsonformseditor', {
            url: '/jsonformseditor',
            template: require('../../_site/partials/docs/jsonformseditor.html')
        })
        .state('docs.setup', {
            url: '/setup',
            template: require('../../_site/partials/docs/setup.html')
        })
        .state('docs.firstform', {
            url: '/firstform',
            template: require('../../_site/partials/docs/firstform.html')
        })
        .state('docs.customrenderer', {
            url: '/customrenderer',
            template: require('../../_site/partials/docs/customrenderer.html')
        })
        .state('docs.customrenderer-es5', {
            url: '/customrenderer-es5',
            template: require('../../_site/partials/docs/customrenderer-es5.html')
        })
        .state('docs.customrenderer-es6', {
            url: '/customrenderer-es6',
            template: require('../../_site/partials/docs/customrenderer-es6.html')
        })
        .state('docs.customrenderer-ts', {
            url: '/customrenderer-ts',
            template: require('../../_site/partials/docs/customrenderer-ts.html')
        })
        .state('docs.uischema', {
            url: '/uischema',
            template: require('../../_site/partials/docs/uischema.html')
        });
}

angular.module('docs.routing', ['docs.menudirective']).config(docsRouting);