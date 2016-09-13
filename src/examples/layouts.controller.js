'use strict';

angular.module('jsonforms-website')
    .controller('LayoutsController', function() {

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
                }
            }
        };
        vm.uiSchemaVertical = {
          "type": "VerticalLayout",
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
              "label": "Birth Date",
              "scope": {
                  "$ref": "#/properties/birthDate"
              }
            }
          ]
        };
        vm.uiSchemaHorizontal = {
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
              "label": "Birth Date",
              "scope": {
                  "$ref": "#/properties/birthDate"
              }
            }
          ]
        };
        vm.uiSchemaGroup = {
          "type": "Group",
          "label": "My Group",
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
              "label": "Birth Date",
              "scope": {
                  "$ref": "#/properties/birthDate"
              }
            }
          ]
        };

        vm.data = {
            name: 'John Doe',
            birthDate: "1985-06-02"
        };

        vm.formattedData = function() {
            return JSON.stringify(vm.data, null, 4);
        };
    });
