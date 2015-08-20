angular.module('makeithappen').controller('MyController', ['$scope', function($scope) {

    $scope.schema = {
        "type": "object",
        "properties": {
            "firstName": {
                "type": "string"
            },
            "lastName": {
                "type": "string"
            },
            "age": {
                "type": "integer"
            }
        }
    };
    $scope.uiSchema = {
        "type": "HorizontalLayout",
        "elements": [
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
                "label": "Age",
                "scope": {
                    "$ref": "#/properties/age"
                }
            }
        ]
    };

    $scope.data = {
        firstName: 'John',
        lastName: 'Doe',
        age: 36
    };

    $scope.formattedData = function() {
        return JSON.stringify($scope.data, null, 4);
    };
}]);

