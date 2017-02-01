'use strict';

var module = angular.module('examples.categoriescontroller',[]);

module.controller('CategoriesController',
    ['category.schema', 'category.uischema', 'category.data', function(Schema, UISchema, Data) {
    var vm = this;
    vm.schema = Schema;
    vm.uiSchema = UISchema;
    vm.data = Data;
}]);
