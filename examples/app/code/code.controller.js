var app = angular.module('makeithappen');

angular.module('makeithappen').controller('CodeController', function() {
    var vm = this;
    vm.schema = {
        "type": "object",
        "properties": {
            "code":{
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "header": {
                            "type": "string"
                        },
                        "content": {
                            "type": "string"
                        }
                    }
                }
            }
        }
    };
    vm.uischema = {
        "type": "VerticalLayout",
        "elements": [
            {
                "type": "Control",
                "scope": {
                    "$ref": "#/properties/code"
                }
            }
        ]
    };

    vm.data = {
        "code": [
            {
                "header": "ES5",
                "content": "var hello = 'world!'"
            },
            {
                "header": "ES6",
                "content": "let hello = 'world!'"
            },
            {
                "header": "Typescript",
                "content": "private hello = 'world!'"
            }
        ]
    };
});
