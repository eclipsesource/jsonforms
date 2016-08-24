'use strict';

angular.module('jsonforms-website')
    .controller('ArraysController', function() {

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
                },
                "occupation": {
                    "type": "string"
                },
                "comments": {
                    "type": "array",
                    "items": {
                        "type":"object",
                        "properties": {
                            "date": {
                                "type": "string",
                                "format": "date-time"
                            },
                            "message": {
                                "type": "string"
                            }
                        }
                    }
                }
            },
            "required": ["occupation", "nationality"]
        };
        vm.uiSchema = {
            "type": "VerticalLayout",
            "elements": [
                {
                    "type": "Control",
                    "scope": {
                        "$ref": "#/properties/comments"
                    },
                    options: {
                        "submit": true
                    }
                }
            ]
        };

        vm.uiSchemaWithSimpleOptionSet = {
            "type": "Control",
            "scope": {
                "$ref": "#/properties/comments"
            },
            "label": "Some more comments",
            options: {
                "simple": true
            }
        };

        vm.data = {
            "comments": [
                {
                    "date": new Date(),
                    "message": "This is an example message"
                },
                {
                    "date": new Date(),
                    "message": "Get ready for booohay"
                }
            ]
        };

        vm.formattedData = function() {
            return JSON.stringify(vm.data, null, 4);
        };
    });
