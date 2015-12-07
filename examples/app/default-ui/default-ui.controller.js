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
            }
        }
    };

    vm.uiSchema = undefined;

    vm.data = {
        name: 'John Doe',
        age: 36
    };

    vm.formattedData = function() {
        return JSON.stringify(vm.data, null, 4);
    };
});