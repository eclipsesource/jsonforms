'use strict';

angular.module('jsonforms-website')
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
