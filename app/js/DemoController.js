angular.module('makeithappen').controller('DemoController', ['$scope', function($scope) {

    $scope.schema = {
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "gender": {
                "type": "string",
                "enum": [ "Male", "Female" ]
            }
        },
        required:["name"]
    };

    $scope.uiSchema = {
        "type": "HorizontalLayout",
        "elements": [
            {
                "label": "Name",
                "type": "Control",
                "scope": {
                    "$ref": "#/properties/name"
                }
            },
            {
                "label": "Gender",
                "type": "Control",
                "scope": {
                    "$ref": "#/properties/gender"
                }
            }
        ]
    };

    $scope.data = {
        name: 'John Doe',
        gender: "Male"
    };


    $scope.formattedData = function() {
        return JSON.stringify($scope.data, null, 4);
    };
}]);
