'use strict';

angular.module('makeithappen', [
    'ngRoute',
    'jsonForms'
]).controller('LocalController', ['$scope', '$q', function($scope, $q) {

    var schema = {
        "type": "object",
        "properties": {
            "id": "user.json",
            "name": {
                "type": "string"
            }
        }
    };

    $scope.getSchema = function() {
        var deferred = $q.defer();
        deferred.resolve(schema);
        return deferred.promise;
    };

    $scope.getUiSchema = function() {
        var deferred = $q.defer();
        deferred.resolve({
            "elements": [
                {
                    "type": "HorizontalLayout",
                    "elements": [
                        {
                            "type": "VerticalLayout",
                            "elements": [
                                {
                                    "type": "Label",
                                    "text": "Name"
                                },
                                {
                                    "type": "Control",
                                    "scope": {
                                        "$ref": "#/properties/name"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        return deferred.promise;
    };
    $scope.getData = function() {
        return {
            name: 'John Doe'
        };
    };
}]).controller('RemoteController', ['$scope', '$http', '$q', function($scope, $http, $q) {

    $scope.getData = function() {
        var deferred = $q.defer();
        $http.get("http://localhost:3000/users")
            .success(function(response) {
                deferred.resolve({
                        "users": response
                    }
                );
            });
        return deferred.promise;
    };

    $scope.getUiSchema = function() {
        var deferred = $q.defer();
        deferred.resolve({
            "elements": [{
                "type": "Table",
                "scope": {
                    "$ref": "#/properties/users/items"
                },
                "columns": [{
                    "label": "First name",
                    "property": "firstName"

                }, {
                    "label": "Height",
                    "property": "height"
                }, {
                    "label": "Nationality",
                    "property": "nationality"
                }]
            }]
        });
        return deferred.promise;
    };

    $scope.getSchema = function() {
        var deferred = $q.defer();
        deferred.resolve({
            "type": "object",
            "properties": {
                "users": {
                    "type": "array",
                    "items": {
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
                            "registrationTime": {
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
                            "birthDate": {
                                "type": "string",
                                "format": "date-time"
                            }
                        },
                        "additionalProperties": false,
                        "required": ["firstName"]
                    }
                }
            }
        });
        return deferred.promise;
    }

}]).controller('RelativeScopeRemoteController', ['$scope', '$http', '$q', function($scope, $http, $q) {

    $scope.getData = function() {
        var deferred = $q.defer();
        $http.get("http://localhost:3000/users?id=54c63acb1803009383463bd0")
            .success(function(response) {
                deferred.resolve(response[0]);
            });
        return deferred.promise;
    };

    $scope.getUiSchema = function() {
        var deferred = $q.defer();
        deferred.resolve({
            "elements": [
                {
                    "type": "HorizontalLayout",
                    "elements": [
                        {
                            "type": "Label",
                            "text": "Can labels have a scope?"
                        },
                        {
                            "type": "Table",
                            "scope": {
                                "$ref": "#/items/properties/albums/items/properties"
                            },
                            "columns": [
                                {
                                    "label": "Album name",
                                    property: {
                                        "$ref": "#/items/properties/albums/items/properties/name"
                                    }
                                }, {
                                    "label": "Release Year",
                                    "property": {
                                        "$ref": "#/items/properties/albums/items/properties/name"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        return deferred.promise;
    };

    $scope.getSchema = function() {
        var deferred = $q.defer();
        deferred.resolve({
            "type": "array",
            "items": {
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
                    "albums": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string"
                                },
                                "releaseYear": {
                                    "type": "number"
                                }
                            }
                        }
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
                    "registrationTime": {
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
                    "birthDate": {
                        "type": "string",
                        "format": "date-time"
                    }
                },
                "additionalProperties": false,
                "required": ["firstName"]
            }
        });
        return deferred.promise;
    }

}]).controller('EditorController', ['RenderService', '$scope', function(RenderService, $scope) {

    $scope.localModelDefault = JSON.stringify(getDefaultSchema(), undefined, 2);
    $scope.localViewDefault = JSON.stringify(getDefaultUiSchema(), undefined, 2);
    $scope.localModel = $scope.localModelDefault;
    $scope.localView= $scope.localViewDefault;

    $scope.getSchema = function() {
        return $scope.localModel;
    };

    $scope.getUiSchema = function() {
        return $scope.localView;
    };

    $scope.getData = function() {
        return {};
    };

    $scope.reparse = function() {
        var localModelObject = JSON.parse($scope.localModel);
        var localViewObject = JSON.parse($scope.localView);

        $scope.localModel = JSON.stringify(localModelObject, undefined, 2);
        $scope.localView = JSON.stringify(localViewObject, undefined, 2);

        replaceRefLinks(localViewObject);

        // TODO: does 2-way databinding work for provided schema/ui-schema?
        var mergedData = RenderService.renderAll(localModelObject, localViewObject, undefined);

        $scope.elements = mergedData;
        $scope.id = mergedData.id;

        $scope.opened = false;
    };

    $scope.aceLoaded = function(editor) {
        editor.$blockScrolling = Infinity;
        editor.getSession().setMode("ace/mode/javascript");
        editor.setOptions({
            enableSnippets: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        });
    };

    function replaceRefLinks(viewModelObject){
        for (var key in viewModelObject) {
            if (key == "feature") {
                var featureObject = viewModelObject[key];
                var pathObject = featureObject["path"];

                var refString = pathObject["$ref"];
                refString = refString.replace(new RegExp(escapeRegExp("/user-schema.json#/"), 'g'), "");
                featureObject["path"] = refString;

            }else if (viewModelObject[key] !== null && typeof(viewModelObject[key]) === "object"){
                replaceRefLinks(viewModelObject[key]);
            }
        }
    }

    function getDefaultUiSchema(){
        return {
            "elements": [
                {
                    "type": "HorizontalLayout",
                    "elements": [
                        {
                            "type": "VerticalLayout",
                            "elements": [
                                {
                                    "type": "Label",
                                    "text": "Personal Data"
                                },
                                {
                                    "type": "Control",
                                    "name": "First name",
                                    "scope": {
                                        "type": "relative",
                                        "path": "firstName"
                                    }
                                },
                                {
                                    "type": "Control",
                                    "name": "Last name",
                                    "scope": {
                                        "type": "relative",
                                        "path": "lastName"
                                    }
                                },
                                {
                                    "type": "Control",
                                    "name": "Birth date",
                                    "scope": {
                                        "type": "relative",
                                        "path": "birthDate"
                                    }
                                },
                                {
                                    "type": "HorizontalLayout",
                                    "elements": [
                                        {
                                            "type": "Control",
                                            "name": "Weight",
                                            "scope": {
                                                "type": "relative",
                                                "path": "weight"
                                            }
                                        },
                                        {
                                            "type": "Control",
                                            "name": "Height",
                                            "scope": {
                                                "type": "relative",
                                                "path": "height"
                                            }
                                        },
                                        {
                                            "type": "Control",
                                            "name": "Nationality",
                                            "scope": {
                                                "type": "relative",
                                                "path": "nationality"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "type": "Control",
                                    "name": "Gender",
                                    "scope": {
                                        "type": "relative",
                                        "path": "gender"
                                    }
                                }
                            ]
                        },
                        {
                            "type": "VerticalLayout",
                            "elements": [
                                {
                                    "type": "Label",
                                    "text": "Site Related Data"
                                },
                                {
                                    "type": "Control",
                                    "name": "Registration time",
                                    "scope": {
                                        "type": "relative",
                                        "path": "registrationTime"
                                    }
                                },
                                {
                                    "type": "Control",
                                    "name": "Email",
                                    "scope": {
                                        "type": "relative",
                                        "path": "email"
                                    }
                                },
                                {
                                    "type": "Control",
                                    "name": "Active",
                                    "scope": {
                                        "type": "relative",
                                        "path": "active"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }

    function getDefaultSchema() {
        return {
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
                "registrationTime": {
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
                "birthDate": {
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
    }
}]).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/local', {
            templateUrl: 'templates/local.html',
            controller: 'LocalController'
        });
        $routeProvider.when('/remote', {
            templateUrl: 'templates/remote.html',
            controller: 'RemoteController'
        });
        $routeProvider.when('/editor', {
            templateUrl: 'templates/editor.html',
            controller: 'EditorController'
        })
    }
])