'use strict';

var module = angular.module('examples.arrayscontroller',[]);

module.controller('ArraysController',
    ['array.schema','array.uischema','array.uischema-simple','array.data',
      function(Schema,UISchema,UISchemaSimple,Data) {
        var vm = this;
        vm.schema = Schema;
        vm.uiSchema = UISchema;
        vm.uiSchemaWithSimpleOptionSet = UISchemaSimple;
        vm.data = Data;

        vm.formattedData = function() {
            return JSON.stringify(vm.data, null, 4);
        };
    }]);
