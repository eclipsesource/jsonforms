'use strict';

var module = angular.module('examples.asynccontroller',[]);

module.controller('AsyncController',  ['async.schema','async.uischema','async.data','$q', function(Schema,UISchema,Data,$q) {

      var vm = this;

      var dataDefer = $q.defer();
      var uiSchemaDefer = $q.defer();
      var schemaDefer = $q.defer();

      vm.dataAsync = dataDefer.promise;
      vm.UIAsync = uiSchemaDefer.promise;
      vm.schemaAsync = schemaDefer.promise;

      vm.dataLoaded= false;
      vm.schemaLoaded= false;
      vm.uiSchemaLoaded= false;

      vm.data = Data;
      vm.uischema = UISchema;
      vm.schema = Schema;

      vm.loaded = function() {
          return vm.dataLoaded && vm.schemaLoaded && vm.uiSchemaLoaded;
      };

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
          vm.dataLoaded = true;
          vm.dataForTemplate = Data;
          dataDefer.resolve(Data);
      };

      vm.loadUI = function(){
          vm.uiSchemaLoaded = true;
          vm.uiSchemaForTemplate = UISchema;
          uiSchemaDefer.resolve(UISchema);
      };

      vm.loadSchema = function(){
          vm.schemaLoaded = true;
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
