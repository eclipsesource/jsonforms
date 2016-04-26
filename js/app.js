'use strict';

angular.module('jsonforms-website', [
    'ngMaterial',
    //'ngRoute',
    'ui.ace',
    'ui.bootstrap',
    //'ui.validate',
    //'ui.grid',
    'jsonforms',
    //'jsonforms-material'
])
/*
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('red')
        //.backgroundPalette('yellow')
        ;
})
*/
.config(function($mdIconProvider) {
    $mdIconProvider.defaultIconSet('./css/mdi.svg');
    $mdIconProvider.defaultViewBoxSize([152]);
})
.config(function($mdThemingProvider) {
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
  $mdThemingProvider.theme('default')
    .primaryPalette('esPaletteDark')
})
/*
.config(
        function($routeProvider, $locationProvider) {
            $routeProvider.when('/home', {
                templateUrl: 'home/home.html',
                controller: 'HomeCtrl'
            });
            $routeProvider.when('/localdemo', {
                templateUrl: 'demo/localdemo.html',
                controller: 'LocalDemoCtrl'
            });
            $routeProvider.when('/docs', {
                //templateUrl: 'docs/docs.html',
                //controller: 'DocsCtrl'
                redirectTo: '/docs/quickstart'
            });
            $routeProvider.when('/docs/quickstart', {
                templateUrl: 'docs/quickstart.html',
                controller: 'DocsCtrl'
            });
            $routeProvider.when('/docs/tutorial', {
                templateUrl: 'docs/tutorial.html',
                controller: 'DocsCtrl'
            });
            $routeProvider.when('/docs/tutorial_emfforms', {
                templateUrl: 'docs/tutorial_emfforms.html',
                controller: 'DocsCtrl'
            });
            $routeProvider.when('/support', {
                templateUrl: 'support/support.html',
                controller: 'SupportCtrl'
            });
            $routeProvider.otherwise({
                redirectTo: '/home'
            });

            $locationProvider.html5Mode(true);
        }
    )
*/
;

var app = angular.module('jsonforms-website');
app.controller('AppCtrl',['StaticData','DynamicData', function(StaticData,DynamicData)  {
    var vm = this;
    /*
    vm.showMainNav = false;
    vm.toggleMainMenu = function () {
        vm.showMainNav = !vm.showMainNav;
    };
*/
    vm.showDocsNav = false;
    vm.toggleDocsMenu = function () {
        vm.showDocsNav = !vm.showDocsNav;
    };
    vm.isSelected=function(selected) {
        //return selected==$location.path();
        return false;
    }

    vm.staticDataProvider=StaticData;
    vm.dynamicDataProvider=DynamicData;
    vm.configAce = function(mode) {
        return {
            onLoad: function (editor) {
                editor.$blockScrolling = Infinity;
                editor.getSession().setMode("ace/mode/"+mode);
                editor.setTheme("ace/theme/sqlserver");
                editor.setOptions({
                    enableSnippets: true,
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true
                });
            }
        }
    };

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

app.directive('docsMenu', ['$location',function($location) {
  return {
    restrict: 'E',
    templateUrl: 'docs/docs_menu.html',
    link: function (scope) {
      scope.showDocsNav = false;
      scope.toggleDocsMenu = function () {
          scope.showDocsNav = !scope.showDocsNav;
      };
      scope.isSelected=function(selected) {
          return $location.absUrl().endsWith(selected);
      };
    }
  };
}]);
app.directive('mainMenu', function() {
  return {
    restrict: 'E',
    templateUrl: 'common/main_menu.html',
    link: function (scope) {
        scope.showMainNav = false;
        scope.toggleMainMenu = function () {
            scope.showMainNav = !scope.showMainNav;
        };
    }
  };
});

app.factory('StaticData', function() {
    var provider={};
    provider.data={};
    provider.dataSchema={
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
            },
        }
    };
    provider.uiSchema={
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
    return provider;
});
app.factory('DynamicData', function() {
    var provider={};
    provider.data={};
    provider.dataSchema={
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
    provider.uiSchema={
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
    return provider;
});
