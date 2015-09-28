'use strict';

angular.module('makeithappen').controller('RemoteController', ['$scope', '$http', '$q', '$resource', function($scope, $http, $q, $resource) {

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
        "type": "Control",
        "scope": {
            "$ref": "#/properties/users"
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

    $scope.AlbumDataProvider = {
        fetchData: function() {
            return Albums.get({id: "54732f005b00004e12c5190c"});
        }
        // no paging, filtering etc. configured
    };

    $scope.uiSchema ={
        "type": "HorizontalLayout",
        "elements": [
            {
                "type": "Label",
                "text": "Can labels have a scope?"
            },
            {
                "type": "Control",
                "scope": {
                    "$ref": "#/items/properties/albums"
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

}])