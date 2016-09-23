'use strict';

angular.module('jsonforms-website')
    .controller('MasterDetailController', function() {

        var vm = this;
        vm.personSchema = {
            "type": "object",
            "properties": {
                "id":"person",
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
            "id":"persons",
            "name": {
                "type": "string"
            },
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
          "name":"Known Persons",
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
          },
          "options":{
            "labelProvider":{"persons":"name","person":"name"}
            // "imageProvider":{"person":"images/examples/person.png"}
          }
        };

        vm.formattedData = function() {
            return JSON.stringify(vm.data, null, 4);
        };
    });
