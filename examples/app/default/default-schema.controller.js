angular.module('makeithappen').controller('DefaultSchemaController',
  ['generate-schema.schema','generate-schema.uischema','generate-schema.data', function(Schema,UISchema,Data) {

    var vm = this;

    vm.schema = Schema;
    vm.uiSchema = UISchema;
    vm.data = Data;

    vm.formattedData = function() {
        return JSON.stringify(vm.data, null, 4);
    };
}]);
