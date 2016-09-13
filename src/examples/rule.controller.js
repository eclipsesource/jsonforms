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
                "birthDate": {
                    "type": "string",
                    "format": "date-time"
                },
                "nationality": {
                    "type": "string",
                    "enum": ["DE", "IT", "JP", "US", "RU", "Other"]
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
              },
              "rule":{
                "effect":"HIDE",
                "condition":{
                  "type":"LEAF" ,
                  "scope": {
                      "$ref": "#/properties/nationality"
                  },
                  "expectedValue":"DE"
                }
              }
            },
            {
              "type": "Control",
              "label": "Birth Date",
              "scope": {
                  "$ref": "#/properties/birthDate"
              },
              "rule":{
                "effect":"SHOW",
                "condition":{
                  "type":"LEAF" ,
                  "scope": {
                      "$ref": "#/properties/nationality"
                  },
                  "expectedValue":"DE"
                }
              }
            },
            {
              "type": "Control",
              "label": "Nationality",
              "scope": {
                  "$ref": "#/properties/nationality"
              }
            }
          ]
        };

        vm.data = {
            name: 'John Doe',
            vegetarian: false,
            birthDate: "1985-06-02"
        };

        vm.formattedData = function() {
            return JSON.stringify(vm.data, null, 4);
        };
    });
