'use strict';

angular.module('jsonforms-website')
    .controller('CategoriesController', function() {

        var vm = this;
        vm.schema = {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "vegetarian": {
                    "type": "boolean"
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
          "type": "Categorization",
          "elements": [
            {
              "type": "Category",
              "label":"Private",
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
            },
            {
              "type": "Category",
              "label":"Additional",
              "elements": [
                {
                  "type": "Control",
                  "label": "Nationality",
                  "scope": {
                      "$ref": "#/properties/nationality"
                  }
                },
                {
                  "type": "Control",
                  "label": "Vegetarian",
                  "scope": {
                      "$ref": "#/properties/vegetarian"
                  }
                }
              ]
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
