'use strict';

angular.module('makeithappen').controller('ArraysController',
  ['array.schema','array.uischema','array.uischema-simple','array.data',
  function(Schema,UISchema,UISchemaSimple,Data) {
    var vm = this;
    vm.schema = Schema;
    vm.uiSchema = UISchema;
    vm.uiSchemaSimple = UISchemaSimple;
    vm.data = Data;

    vm.formattedData = function() {
        return JSON.stringify(vm.data, null, 4);
    };
}]);
