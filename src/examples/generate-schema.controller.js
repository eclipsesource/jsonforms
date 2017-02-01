'use strict';

var module = angular.module('examples.generateschemacontroller',[]);

module.controller('GenerateSchemaController',   ['generate-schema.schema','generate-schema.uischema','generate-schema.data', function(Schema,UISchema,Data) {

    var vm = this;

    vm.schema = Schema;
    vm.uiSchema = UISchema;
    vm.data = Data;
}]);
