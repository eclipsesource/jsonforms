angular.module('makeithappen').controller('MyController', ['$scope', function($scope) {

    $scope.schema = {
        "type": "object",
        "properties": {
            "firstName": {
                "type": "string",
                "minLength": 3
            },
            "lastName": { "type": "string" },
            "age": {
                "type": "integer",
                "minimum": 20
            },
            "address": {
                "type": "object",
                "properties": {
                    "street": {
                        "type": "string"
                    }
                }
            }
        },
        "required": ["lastName", "firstName"]
    };
    $scope.uiSchema = {
        "type": "HorizontalLayout",
        "elements": [
            {
                "type": "Control",
                "label": "First name",
                "scope": { "$ref": "#/properties/firstName" }
            },
            {
                "type": "Control",
                "label": "Last name",
                "scope": { "$ref": "#/properties/lastName" }
            },
            {
                "type": "Control",
                "label": "Age",
                "scope": { "$ref": "#/properties/age" }
            },
            {
                "type": "Control",
                "scope": { "$ref": "#/properties/address/properties/street" }
            }
        ]
    };

    $scope.data = {};

    $scope.formattedData = function() {
        return JSON.stringify($scope.data, null, 4);
    };
}]);

