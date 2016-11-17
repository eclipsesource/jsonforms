'use strict';


var app = angular.module('makeithappen');

angular.module('makeithappen').controller('CategoryController',['category.schema','category.uischema','category.data', function(Schema,UISchema,Data) {
    var vm = this;
    vm.schema = Schema;
    vm.uiSchema = UISchema;
    vm.data = Data;

    vm.formattedData = function() {
        return JSON.stringify(vm.data, null, 4);
    };
}]);
