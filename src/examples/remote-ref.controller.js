'use strict';

angular.module('jsonforms-website').controller('RemoteRefController',
    ['resolve.schema', 'resolve.uischema', 'resolve.data', function(Schema, UISchema, Data) {
    var vm = this;
    vm.schema = Schema;
    vm.uischema = UISchema;
    vm.data = Data;
}]);
