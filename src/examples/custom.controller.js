'use strict';

angular.module('jsonforms-website').controller('CustomControlController',
['custom.schema','custom.uischema','custom.data', function(Schema,UISchema,Data) {
    var vm = this;
    vm.schema = Schema;
    vm.uiSchema = UISchema;

    vm.data = Data;
}]);
