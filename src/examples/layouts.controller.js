'use strict';

var module = angular.module('examples.layoutscontroller',[]);

module
    .controller('LayoutsController',
    ['layouts.schema','layouts.uischema-vertical','layouts.uischema-horizontal','layouts.uischema-group','layouts.uischema-complex','layouts.data',
function(Schema,UISchemaVertical,UISchemaHorizontal,UISchemaGroup,UISchemaComplex,Data) {
    var vm = this;
    vm.schema = Schema;
    vm.uiSchemaVertical = UISchemaVertical;
    vm.uiSchemaHorizontal = UISchemaHorizontal;
    vm.uiSchemaGroup = UISchemaGroup;
    vm.uiSchemaComplex = UISchemaComplex;
    vm.data = Data;

    vm.formattedData = function() {
        return JSON.stringify(vm.data, null, 4);
    };
}]);
