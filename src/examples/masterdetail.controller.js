'use strict';

angular.module('jsonforms-website')
    .controller('MasterDetailController', function() {

        var vm = this;
        vm.personSchema = {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "nationality": {
                    "type": "string",
                    "enum": ["DE", "IT", "JP", "US", "RU", "Other"]
                }
            }
        };
        vm.schema = {
          "type": "object",
          "properties": {
            "friends":{
                "type": "array",
                "items": vm.personSchema
            },
            "enemies":{
                "type": "array",
                "items": vm.personSchema
            }
          }
        };
        vm.data ={
          "friends":
          [
            {
              name: 'Todd'
            },
            {
              name: 'Anna'
            }
          ],
          "enemies":
          [
            {
              name: 'Bob'
            },
            {
              name: 'Jane'
            }
          ]
        };
        vm.uiSchema = {
          "type":"MasterDetailLayout",
          "scope": {
              "$ref": "#"
          }
        };

        vm.formattedData = function() {
            return JSON.stringify(vm.data, null, 4);
        };
    });
