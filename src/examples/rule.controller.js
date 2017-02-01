'use strict';
//TODO: Replace with this:
/*
['rule.schema','rule.uischema','rule.data', function(Schema,UISchema,Data) {
    var vm = this;
    vm.schema = Schema;
    vm.uiSchema = UISchema;
    vm.data = Data;

    vm.formattedData = function() {
        return JSON.stringify(vm.data, null, 4);
    };
}]);
*/

var module = angular.module('examples.rulecontroller',[]);

module
    .controller('RuleController', function() {

        var vm = this;
        vm.schema = {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "alive": {
                    "type": "boolean"
                },
                "kindOfDead": {
                    "type": "string",
                    "enum": ["Zombie", "Vampire", "Ghoul"]
                }
            }
        };
        vm.uiSchema = {
          "type": "HorizontalLayout",
          "elements": [
            {
              "type": "Control",
              "label": "Name",
              "scope": {
                  "$ref": "#/properties/name"
              }
            },
            {
              "type": "Control",
              "label": "Is Alive?",
              "scope": {
                  "$ref": "#/properties/alive"
              }
            },
            {
              "type": "Control",
              "label": "Kind of dead",
              "scope": {
                  "$ref": "#/properties/kindOfDead"
              },
              "rule":{
                "effect":"SHOW",
                "condition":{
                  "type":"LEAF" ,
                  "scope": {
                      "$ref": "#/properties/alive"
                  },
                  "expectedValue": false
                }
              }
            }
          ]
        };

        vm.data = {
            name: 'John Doe',
            alive: true,
            kindOfDead: 'Zombie'
        };

        vm.formattedData = function() {
            return JSON.stringify(vm.data, null, 4);
        };
    });
