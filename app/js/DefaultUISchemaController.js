angular.module('makeithappen').controller('DefaultUISchemaController', ['$scope', function($scope) {

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
    $scope.uiSchema = undefined;

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

    $scope.formattedData = function() {
        return JSON.stringify($scope.data, null, 4);
    };
}]);