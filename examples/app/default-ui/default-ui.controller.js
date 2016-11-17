angular.module('makeithappen').controller('DefaultUISchemaController',
['generate-uischema.schema','generate-uischema.uischema','generate-uischema.data', function(Schema,UISchema,Data) {
    var vm = this;
    vm.schema = Schema;
    vm.uiSchema = UISchema;
    vm.data = Data;

    vm.formattedData = function() {
        return JSON.stringify(vm.data, null, 4);
    };
}]);
