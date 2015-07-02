'use strict';

angular.module('makeithappen', [
    'ngRoute',
    'ngResource',
    'jsonForms',
    'ui.ace'
]).controller('LocalController', ['$scope', function($scope) {

    $scope.schema = {
        "type": "object",
        "properties": {
            "id": "user.json",
            "name": {
                "type": "string"
            },
            "age": {
                "type": "integer"
            }
        }
    };
    $scope.uiSchema = {
        "elements": [
            {
                "type": "HorizontalLayout",
                "elements": [
                    {
                        "type": "VerticalLayout",
                        "elements": [
                            {
                                "type": "Control",
                                "label": "Name",
                                "scope": {
                                    "$ref": "#/properties/name"
                                }
                            }
                        ]
                    },
                    {
                        "type": "VerticalLayout",
                        "elements": [
                            {
                                "type": "Control",
                                "label": "Age",
                                "scope": {
                                    "$ref": "#/properties/age"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };

    $scope.usersSchema = {
        "type": "array",
        "items": $scope.schema
    };
    $scope.usersUiSchema = {
        "elements": [
            {
                "type": "Table",
                "scope": {
                    "$ref": "#/items"
                },
                "columns": [
                    {
                        "label": "Name",
                        "scope": {
                            "$ref": "#/items/properties/name"
                        }
                    },
                    {
                        "label": "Age",
                        "scope": {
                            "$ref": "#/items/properties/age"
                        }
                    }
                ]
            }
        ]
    };


    $scope.data = {
        name: 'John Doe',
        age: 36
    };

    $scope.users = [
        $scope.data,
        {
            name: 'Todd',
            age: 33
        },
        {
            name: 'Jimmy',
            age: 34
        }
    ];

    $scope.formattedData = function() {
        return JSON.stringify($scope.data, null, 4);
    };

}]).controller('RemoteController', ['$scope', '$http', '$q', '$resource', function($scope, $http, $q, $resource) {

    var Users = $resource('http://localhost:3000/users/:id');
    var pageSize = 1;

    $scope.UserDataProvider = {
        fetchData: function() {
            return Users.query();
        },
        fetchPage: function(page, size) {
            var startPage = page/pageSize;
            return Users.query({_start: startPage, _end: startPage + pageSize})
        },
        setPageSize: function(newSize) {
            pageSize = newSize;
        }
    };

    $scope.uiSchema = {
        "elements": [{
            "type": "Table",
            "scope": {
                "$ref": "#/properties/users/items"
            },
            "columns": [{
                "label": "First name",
                "scope": {
                    "$ref":  "#/properties/users/items/firstName"
                }
            }, {
                "label": "Height",
                "scope": {
                    "$ref": "#/properties/users/items/height"
                }
            }, {
                "label": "Nationality",
                "scope": {
                    "$ref":  "#/properties/users/items/nationality"
                }
            }]
        }]
    };

    $scope.schema = {
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
    };

}]).controller('RelativeScopeRemoteController', ['$scope', '$http', '$q', '$resource', function($scope, $http, $q, $resource) {

    var Albums = $resource('http://localhost:3000/users/:id');
    $scope.data = Albums.get({id: "54732f005b00004e12c5190c"});

    $scope.AlbumDataProvider = {
        fetchData: function() {
            return Albums.get({id: "54732f005b00004e12c5190c"});
        }
        // no paging, filtering etc. configured
    };

    $scope.uiSchema ={
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
                            "$ref": "#/items/properties/albums/items"
                        },
                        "columns": [
                            {
                                "label": "Album name",
                                "scope": {
                                    "$ref": "#/items/properties/albums/items/properties/name"
                                }
                            }, {
                                "label": "Release Year",
                                "scope": {
                                    "$ref": "#/items/properties/albums/items/properties/releaseYear"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };

    $scope.schema = {
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
    };

}]).controller('EditorController', ['RenderService', '$scope', function(RenderService, $scope) {

    $scope.localModelDefault = JSON.stringify($scope.schema, undefined, 2);
    $scope.localViewDefault = JSON.stringify($scope.uiSchema, undefined, 2);
    $scope.localModel = $scope.localModelDefault;
    $scope.localView = $scope.localViewDefault;

    $scope.data = {};

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

    $scope.uiSchema = {
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
                                "label": "First name",
                                "scope": {
                                    "$ref": "#/properties/firstName"
                                }
                            },
                            {
                                "type": "Control",
                                "label": "Last name",
                                "scope": {
                                    "$ref": "#/properties/lastName"
                                }
                            },
                            {
                                "type": "Control",
                                "label": "Birth date",
                                "scope": {
                                    "$ref": "#/properties/birthData"
                                }
                            },
                            {
                                "type": "HorizontalLayout",
                                "elements": [
                                    {
                                        "type": "Control",
                                        "label": "Weight",
                                        "scope": {
                                            "$ref": "#/properties/weight"
                                        }
                                    },
                                    {
                                        "type": "Control",
                                        "label": "Height",
                                        "scope": {
                                            "$ref": "#/properties/height"
                                        }
                                    },
                                    {
                                        "type": "Control",
                                        "label": "Nationality",
                                        "scope": {
                                            "$ref": "#/properties/nationality"
                                        }
                                    }
                                ]
                            },
                            {
                                "type": "Control",
                                "label": "Gender",
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
                                "type": "Label",
                                "text": "Site Related Data"
                            },
                            {
                                "type": "Control",
                                "label": "Registration time",
                                "scope": {
                                    "$ref": "#/properties/registrationTime"
                                }
                            },
                            {
                                "type": "Control",
                                "label": "Email",
                                "scope": {
                                    "$ref": "#/properties/email"
                                }
                            },
                            {
                                "type": "Control",
                                "label": "Active",
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

    $scope.schema = {
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