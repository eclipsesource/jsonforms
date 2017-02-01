'use strict';

var module = angular.module('examples.customcontroller',[]);

module.controller('CustomControlController',
['custom.schema','custom.uischema','custom.data', function(Schema,UISchema,Data) {
    var vm = this;
    vm.schema = Schema;
    vm.uiSchema = UISchema;

    vm.data = Data;
}]);
