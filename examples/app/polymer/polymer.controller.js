angular.module('makeithappen').controller('PolymerController', function() {
    var vm = this;
    vm.schema = {
        "type": "object",
        "properties": {
            "firstName": {
                "type": "string",
                "minLength": 3
            },
            "lastName": {
                "type": "string"
            },
            "personalData": {
                "type": "object",
                "properties": {
                    "age": {
                        "type": "integer"
                    },
                    "height": {
                        "type": "number"
                    }
                },
                "required": ["age", "height"]
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
            },
            "occupation": {
                "type": "string"
            },
            "test_wrong": {
                "type": "array",
                "items": {"type":"string"}
            },
            "test_correct": {
                "type": "array",
                "items": {"type":"object","properties": {"name": {"type": "string"}}}
            }
        },
        "required": ["occupation"]
    };
    vm.uiSchema = {
        "type": "Control",
        "label": "Polymer name",
        "scope": {
            "$ref": "#/properties/lastName"
        }
    };
    vm.data = {
        firstName: 'John',
        vegetarian: false,
        birthDate: "02.06.1985",
        nationality: "US"
    };

    vm.formattedData = function() {
        return JSON.stringify(vm.data, null, 4);
    };
});

