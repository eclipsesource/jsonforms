'use strict';

var app = angular.module('makeithappen');

angular.module('makeithappen').controller('AsyncController', ['async.schema','async.uischema','async.data','$q', function(Schema,UISchema,Data,$q) {
    var vm = this;


    var dataDefer = $q.defer();
    var UIDefer = $q.defer();
    var schemaDefer = $q.defer();

    vm.dataAsync = dataDefer.promise;
    vm.UIAsync = UIDefer.promise;
    vm.schemaAsync = schemaDefer.promise;

    vm.data = Data;
    vm.uischema = UISchema;
    vm.schema = Schema;

    vm.loadDataAsyncFun = function () {
        return $q.when(vm.data);
    };

    vm.loadSchemaAsyncFun = function () {
        return $q.when(vm.schema);
    };

    vm.loadUiSchemaAsyncFun = function () {
        return $q.when(vm.uischema);
    };

    vm.loadData = function(){
        vm.dataForTemplate = Data;
        dataDefer.resolve(Data);
    };

    vm.loadUI = function(){
        vm.uiSchemaForTemplate = UISchema;
        UIDefer.resolve(UISchema);
    };

    vm.loadSchema = function(){
        vm.schemaForTemplate = Schema;
        schemaDefer.resolve(Schema);
    };

    vm.formattedData = function() {
        return JSON.stringify(vm.users, null, 4);
    };

    vm.loadDataFunc = function(){
        return Data;
    };

    vm.loadUIFunc = function(){
        return UISchema;
    };

    vm.loadSchemaFunc = function(){
        return Schema;
    };

}]);
