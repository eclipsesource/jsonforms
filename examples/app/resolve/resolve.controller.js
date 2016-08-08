'use strict';

angular.module('makeithappen').controller('ResolveController', function() {
    var vm = this;
    vm.schema = {
        "definitions": {
            "address": {
              "type": "object",
              "properties": {
                "street_address": { "type": "string" },
                "city":           { "type": "string" },
                "state":          { "type": "string" },
                "coord":          { "$ref": "#/definitions/coord" }
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
    vm.uiSchema = {
        "type": "VerticalLayout",
        "elements": [
            {
                "type": "HorizontalLayout",
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
                    }
                ]
            },
            {
                "type": "Label",
                "text": "The 'Latitude' and 'Longitude' fields were inferred via a JSON Schema $ref pointing to http://json-schema.org/geo"
            },
            {
                "type": "HorizontalLayout",
                "elements": [
                    {
                        "type": "HorizontalLayout",
                        "elements": [
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
                    }
                ]
            }
        ]
    };


    vm.data = {
        "address": {
            "street_address": "Agnes-Pockels Bogen 1",
            "city": "Munich",
            "state": "Bavaria"
        }
    };

    vm.formattedData = function() {
        return JSON.stringify(vm.data, null, 4);
    };
});
