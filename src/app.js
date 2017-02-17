'use strict';

var StaticData = {};
StaticData.data = {};
StaticData.dataSchema = {
    "type": "object",
    "properties": {
        "firstName": {
            "type": "string"
        },
        "lastName": {
            "type": "string"
        },
        "gender": {
            "type": "string",
            "enum": [
                "Male",
                "Female",
                "Other"
            ]
        },
        "active": {
            "type": "boolean"
        },
        "dateOfBirth": {
            "type": "string",
            "format": "date-time"
        }
    }
};
StaticData.uiSchema = {
    "type": "VerticalLayout",
    "elements": [
        {
            "type": "HorizontalLayout",
            "elements": [
                {
                    "type": "Control",
                    "scope": {
                        "$ref": "#/properties/firstName"
                    }
                },
                {
                    "type": "Control",
                    "scope": {
                        "$ref": "#/properties/lastName"
                    }
                }
            ]
        },
        {
            "type": "Control",
            "scope": {
                "$ref": "#/properties/gender"
            }
        },
        {
            "type": "Control",
            "scope": {
                "$ref": "#/properties/dateOfBirth"
            }
        }
    ]
};

var DynamicData = {};
DynamicData.data = {};
DynamicData.dataSchema = {
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "format": "objectId"
        },
        "lastName": {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "firstName": {
            "type": "string"
        },
        "gender": {
            "type": "string",
            "enum": [
                "Male",
                "Female"
            ]
        },
        "active": {
            "type": "boolean"
        },
        "timeOfRegistration": {
            "type": "string",
            "format": "date-time"
        },
        "weight": {
            "type": "number"
        },
        "height": {
            "type": "integer"
        },
        "nationality": {
            "type": "string",
            "enum": [
                "German",
                "French",
                "UK",
                "US",
                "Spanish",
                "Italian",
                "Russian"
            ]
        },
        "dateOfBirth": {
            "type": "string",
            "format": "date-time"
        }
    },
    "additionalProperties": false,
    "required": [
        "id",
        "lastName",
        "email"
    ]
};
DynamicData.uiSchema = {
    "type": "VerticalLayout",
    "elements": [
        {
            "type": "HorizontalLayout",
            "elements": [
                {
                    "type": "VerticalLayout",
                    "elements": [
                        {
                            "type": "Control",
                            "scope": {
                                "$ref": "#/properties/firstName"
                            }
                        },
                        {
                            "type": "Control",
                            "scope": {
                                "$ref": "#/properties/lastName"
                            }
                        },
                        {
                            "type": "Control",
                            "scope": {
                                "$ref": "#/properties/dateOfBirth"
                            }
                        },
                        {
                            "type": "HorizontalLayout",
                            "elements": [
                                {
                                    "type": "Control",
                                    "scope": {
                                        "$ref": "#/properties/weight"
                                    }
                                },
                                {
                                    "type": "Control",
                                    "scope": {
                                        "$ref": "#/properties/height"
                                    }
                                },
                                {
                                    "type": "Control",
                                    "scope": {
                                        "$ref": "#/properties/nationality"
                                    }
                                }
                            ]
                        },
                        {
                            "type": "Control",
                            "scope": {
                                "$ref": "#/properties/gender"
                            }
                        }
                    ]
                },
                {
                    "type": "VerticalLayout",
                    "elements": [
                        {
                            "type": "Control",
                            "scope": {
                                "$ref": "#/properties/timeOfRegistration"
                            }
                        },
                        {
                            "type": "Control",
                            "scope": {
                                "$ref": "#/properties/email"
                            }
                        },
                        {
                            "type": "Control",
                            "scope": {
                                "$ref": "#/properties/active"
                            }
                        }
                    ]
                }
            ]
        }

    ]
};


// CSS
require('angular-material/angular-material.min.css');
require('../css/main.css');
require('../css/syntax.css');

// Libs
require('angular');
require('angular-animate');
require('angular-aria');
require('angular-material');
require('angular-ui-router');

require('oclazyload');
require('./examples/examples.routing');
require('./docs/docs.routing');

angular.module('jsonforms-website', [
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'ui.router',
    'oc.lazyLoad',
    'docs.routing',
    'examples.routing'
]).directive('mainMenu', function() {
    return {
        restrict: 'E',
        template: require('../partials/common/main_menu.html'),
        link: function (scope) {
            scope.showMainNav = false;
            scope.toggleMainMenu = function() {
                scope.showMainNav = !scope.showMainNav;
            };
            scope.hideMainMenu = function() {
                scope.showMainNav = false;
            };
        }
    };
}).directive('supportPanel', function() {
    return {
        restrict: 'E',
        template: require('../partials/docs/support_panel.html')
    };
}).config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('/', {
                url: '/',
                template: require('../partials/landing.html'),
                controller: 'IndexController',
                controllerAs: 'vm'
            })
            .state('support', {
                url: '/support',
                template: require('../partials/support.html'),
                controller: 'SupportController',
                controllerAs: 'vm'
            })
            .state('imprint', {
                url: '/imprint',
                template: require('../partials/imprint.html')
            });
        $urlRouterProvider.otherwise('/');
    }
]).config(['$mdIconProvider', function($mdIconProvider) {
    // require('mdi/fonts/materialdesignicons-webfont.eot');
    $mdIconProvider.defaultIconSet(require('../css/mdi.svg'));
    $mdIconProvider.defaultViewBoxSize([152]);
}]).config(['$mdThemingProvider', function($mdThemingProvider) {
    $mdThemingProvider.definePalette('esPalette', {
        '50': '#ffffff',
        '100': '#e9f3fa',
        '200': '#bbd8f0',
        '300': '#80b7e4',
        '400': '#67a8de',
        '500': '#4e9ad9',
        '600': '#358cd4',
        '700': '#297cc0',
        '800': '#246ca7',
        '900': '#1f5c8e',
        'A100': '#ffffff',
        'A200': '#e9f3fa',
        'A400': '#67a8de',
        'A700': '#297cc0',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': '50 100 200 300 400 500 A100 A200 A400'
    });
    $mdThemingProvider.definePalette('esPaletteDark', {
        '50': '#9bd0ff',
        '100': '#4facff',
        '200': '#1792ff',
        '300': '#006dce',
        '400': '#005db0',
        '500': '#004d91',
        '600': '#003d72',
        '700': '#002c54',
        '800': '#001c35',
        '900': '#000c17',
        'A100': '#9bd0ff',
        'A200': '#4facff',
        'A400': '#005db0',
        'A700': '#002c54',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': '50 100 A100 A200'
    });
    $mdThemingProvider.theme('default').primaryPalette('esPaletteDark')
}]).controller('IndexController', ['$anchorScroll', '$location', function($anchorScroll, $location)  {
    var vm = this;
    vm.configAce = function(mode) {
        return {
            onLoad: function (editor) {
                editor.getSession().setMode("ace/mode/json");
                editor.$blockScrolling = Infinity;
                editor.getSession().setUseWorker(false);
                editor.setOptions({
                                        enableSnippets: false,
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true
                                        });

            }
        }
    };
    vm.scrollTo = function(id) {
        $location.hash(id);
        $anchorScroll();
    };
    vm.isSelected = function(selected) {
        //return selected==$location.path();
        return false;
    };

    vm.openEditorInNewTab = function () {
        vm.reparseStatic();

        var tab = window.open('http://jsonforms-editor.herokuapp.com/#/demo');
        var data = {
            dataSchema: vm.localStaticModelObject,
            uiSchema: vm.localStaticViewObject
        };
        var passedByReference = { ackReceived: false };

        window.addEventListener('message', function(event) {
            if (event.data == 'ACK') {
                window.removeEventListener('message', function() {}, false);
                passedByReference.ackReceived = true;
            }
        }, false);

        vm.postMessagetoTab(tab, data, passedByReference);
    };

    vm.postMessagetoTab = function(tab, data, passedByReference) {
        setTimeout(function () {
            tab.postMessage(data, '*');
            if (!passedByReference.ackReceived) {
                vm.postMessagetoTab(tab, data, passedByReference);
            }
        }, 1000);
    };

    vm.staticDataProvider = StaticData;
    vm.dynamicDataProvider = DynamicData;

    vm.localStaticModelObject=vm.staticDataProvider.dataSchema;
    vm.localStaticViewObject=vm.staticDataProvider.uiSchema;
    vm.localStaticModel = JSON.stringify(vm.localStaticModelObject, undefined, 2);
    vm.localStaticView = JSON.stringify(vm.localStaticViewObject, undefined, 2);

    vm.reparseStatic = function() {
        vm.localStaticModelObject = JSON.parse(vm.localStaticModel);
        vm.localStaticViewObject = JSON.parse(vm.localStaticView);
    };

    vm.localDynamicModelObject=vm.dynamicDataProvider.dataSchema;
    vm.localDynamicViewObject=vm.dynamicDataProvider.uiSchema;
    vm.localDynamicModel = JSON.stringify(vm.localDynamicModelObject, undefined, 2);
    vm.localDynamicView = JSON.stringify(vm.localDynamicViewObject, undefined, 2);

    vm.reparseDynamic = function() {
        vm.localDynamicModelObject = JSON.parse(vm.localDynamicModel);
        vm.localDynamicViewObject = JSON.parse(vm.localDynamicView);
    };
}]);

// Our code
require('./support/support.controller');
