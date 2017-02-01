'use strict';

var module = angular.module('examples.generateuicontroller',[]);

module.controller('GenerateUiSchemaController', ['generate-uischema.schema','generate-uischema.uischema','generate-uischema.data', function(Schema,UISchema,Data) {
    var vm = this;
    vm.schema = Schema;
    vm.uiSchema = UISchema;
    vm.data = Data;
}]);
