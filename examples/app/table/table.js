var app = angular.module('makeithappen');

app.controller('MyTableController', ['$scope', function($scope) {
    $scope.schema = schema;
    $scope.uiSchema = uischema;
    $scope.data = {
        "people": [{name: "Francisco", age: 22, gender: "Male"}, {name: "Hector", age: 22, gender: "Female"}]
    };
}]);


var uischema = {
    "type": "HorizontalLayout",
    "elements": [
        {
            "type": "Control",
            "options": {
                "primaryItems": ["name", "age"]
            },
            "scope": { "$ref": "#/properties/people" }
        }
    ]
};

var schema = {
    "type": "object",
    "properties": {
        "people": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "age": {
                        "type": "integer"
                    },
                    "gender": {
                        "type": "string",
                        "enum": ["Male", "Female"]
                    }
                }
            },
        }
    }
};


