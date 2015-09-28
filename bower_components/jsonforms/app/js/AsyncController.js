angular.module('makeithappen').controller('AsyncController', ['$scope', '$http', '$q', '$resource', function($scope, $http, $q, $resource) {

    var Users = $resource('http://localhost:3000/users/:id');
    var pageSize = 1;

    $scope.UserDataProvider = {
        fetchData: function() {
            var promise = Users.query().$promise;
            return promise.then(function(users) {
                $scope.data = users[0];
                return users[0];
            });
        }
    };

    $scope.fetchSchema = function() {
        var p = $q.defer();
        p.resolve($scope.schema);
        return p;
    };

    $scope.fetchUiSchema = function() {
        var p = $q.defer();
        p.resolve($scope.uiSchema);
        return p;
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
        "required": ["firstName"]
    };

    $scope.uiSchema = {
        "type": "HorizontalLayout",
        "elements": [
            {
                "type": "Control",
                "label": "Name",
                "scope": {
                    "$ref": "#/properties/firstName"
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
    };

    $scope.usersSchema = {
        "type": "array",
        "items": $scope.schema
    };
    $scope.usersUiSchema = {
        "elements": [
            {
                "type": "Control",
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

}]);