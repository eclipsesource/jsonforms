angular.module('makeithappen').controller('DefaultUISchemaController', function() {
    var vm = this;
    vm.schema = {
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
            }
        }
    };

    vm.uiSchema = undefined;

    vm.data = {
        name: 'John Doe',
        age: 36,
        height: 1.76,
        vegetarian: true
    };

    vm.formattedData = function() {
        return JSON.stringify(vm.data, null, 4);
    };
});