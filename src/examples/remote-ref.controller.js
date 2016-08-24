'use strict';

angular.module('jsonforms-website')
    .controller('RemoteRefController', function() {
        var vm = this;
        vm.schema = {
            "definitions": {
                "address": {
                    "type": "object",
                    "properties": {
                        "street_address": { "type": "string" },
                        "city":           { "type": "string" },
                        "state":          { "type": "string" },
                        "coord":          { "$ref": "#/definitions/coord" },
                    },
                    "required": ["street_address", "city", "state"]
                },
                "coord": {"$ref":"http://json-schema.org/geo"}
            },

            "type": "object",
            "properties": {
                "address": { "$ref": "#/definitions/address" }
            }
        };
        vm.uischema = {
            "type": "VerticalLayout",
            "elements": [
                {
                    "type": "Control",
                    "scope": {
                        "$ref": "#/properties/address/properties/street_address"
                    }
                },
                {
                    "type": "Control",
                    "scope": {
                        "$ref": "#/properties/address/properties/city"
                    }
                },
                {
                    "type": "Control",
                    "scope": {
                        "$ref": "#/properties/address/properties/state"
                    }
                },
                {
                    "type": "Control",
                    "scope": {
                        "$ref": "#/properties/address/properties/coord/properties/latitude"
                    }
                },
                {
                    "type": "Control",
                    "scope": {
                        "$ref": "#/properties/address/properties/coord/properties/longitude"
                    }
                }
            ]
        };

        vm.data = {

        };

        vm.formattedData = function() {
            return JSON.stringify(vm.data, null, 4);
        };
    });
