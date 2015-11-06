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
            },
            // primitive array, we actually do not have a renderer for this atm
            "hobbies": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            // complex array
            "friends": {
                "type": "array",
                "items": {
                            "type": "object",
                            "properties": {
                                "nickName": {
                                    "type": "string"
                                },
                                "age": {
                                    "type": "integer"
                                }
                            }
                }
            }
        },
        "required": ["lastName", "firstName"]
    };
    $scope.uiSchema = {
        "type": "VerticalLayout",
        "elements": [
            {
                "type": "HorizontalLayout",
                "label": "Person Details",
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
            },
            {
                "type": "Control",
                "scope": { "$ref": "#/properties/friends" },
            }
        ]
    };

    $scope.data = {
        "hobbies": ["cooking", "playing video games"],
        "friends": [{
            "nickName": "Ottgar",
            "age": 28
        }]
    };

    $scope.formattedData = function() {
        return JSON.stringify($scope.data, null, 4);
    };
}]);

