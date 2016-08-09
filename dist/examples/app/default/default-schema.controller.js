angular.module('makeithappen').controller('DefaultSchemaController', function() {

    var vm = this;

    vm.schema = undefined;
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