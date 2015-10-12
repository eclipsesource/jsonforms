angular.module('makeithappen').controller('LocalController', ['$scope', function($scope) {

    $scope.schema = {
        "type": "object",
        "properties": {
            "id": "user.json",
            "name": {
                "type": "string"
            },
            "age": {
                "type": "integer"
            },
            "height": {
                "type": "number"
            },
            "vegetarian": {
                "type": "boolean"
            },
            "birthDate": {
                "type": "string",
                "format": "date-time"
            },
            "nationality": {
                "type": "string",
                "enum": ["DE", "IT", "JP", "US", "RU", "Other"]
            }
        }
    };
    $scope.uiSchema = {
        "type": "HorizontalLayout",
        "elements": [
            {
                "type": "Control",
                "label": "Name",
                "scope": {
                    "$ref": "#/properties/name"
                }
            },
            {
                "type": "Control",
                "label": "Age",
                "scope": {
                    "$ref": "#/properties/age"
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
                "label": "Vegetarian",
                "scope": {
                    "$ref": "#/properties/vegetarian"
                }
            },
            {
                "type": "Control",
                "label": "Nationality",
                "scope": {
                    "$ref": "#/properties/nationality"
                }
            },
            {
                "type": "Control",
                "label": "Birthday",
                "scope": {
                    "$ref": "#/properties/birthDate"
                }
            }
        ]
    };

    $scope.usersSchema = {
        "type": "array",
        "items": $scope.schema
    };
    $scope.usersUiSchema = {
        "type": "Control",
        "scope": {
            "$ref": "#"
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
    };

    $scope.data = {
        name: 'John Doe',
        age: 36,
        height: 1.76,
        vegetarian: false,
        birthDate: "02.06.1985",
        nationality: "US"
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
        },
        {
            name: 'Max',
            age: 35
        },
        {
            name: 'Jonas',
            age: 34
        },
        {
            name: 'Edgar',
            age: 30
        },
        {
            name: 'Eugen',
            age: 28
        },
        {
            name: 'Johannes',
            age: 26
        },
        {
            name: 'Alex',
            age: 25
        },
        {
            name: 'Stefan',
            age: 27
        },
        {
            name: 'Eva',
            age: 30
        }
    ];

    $scope.formattedData = function() {
        return JSON.stringify($scope.data, null, 4);
    };
}]);