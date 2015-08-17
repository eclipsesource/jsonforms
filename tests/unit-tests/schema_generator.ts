/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/angularjs/angular-mocks.d.ts"/>
/// <reference path="../../js/services.ts"/>
/// <reference path="../../typings/schemas/uischema.d.ts"/>

describe('SchemaGenerator', () => {

    var SchemaGenerator: jsonforms.services.ISchemaGenerator;

    beforeEach(module('jsonForms.services'));
    beforeEach(() => {
        inject(function(_SchemaGenerator_: jsonforms.services.ISchemaGenerator) {
            SchemaGenerator = _SchemaGenerator_;
        });
    });

    it("generate schema for empty instance", function () {
        var instance = {};
        var schema = {
            "type": "object",
            "properties": {},
            "additionalProperties": true,
            "required": []
        };
        expect(SchemaGenerator.generateDefaultSchema(instance)).toEqual(schema);
    });

    it("generate schema for instance with string properties", function () {
        var instance = {
            "property1": "value1",
            "property2": "value2"
        };
        var schema = {
            "type": "object",
            "properties": {
                "property1": {
                    "type": "string"
                },
                "property2": {
                    "type": "string"
                }
            },
            "additionalProperties": true,
            "required": ["property1", "property2"]
        };
        expect(SchemaGenerator.generateDefaultSchema(instance)).toEqual(schema);
    });

    it("generate schema for instance with string and boolean properties", function () {
        var instance = {
            "property1": true,
            "property2": "value2"
        };
        var schema = {
            "type": "object",
            "properties": {
                "property1": {
                    "type": "boolean"
                },
                "property2": {
                    "type": "string"
                }
            },
            "additionalProperties": true,
            "required": ["property1", "property2"]
        };
        expect(SchemaGenerator.generateDefaultSchema(instance)).toEqual(schema);
    });

    it("generate schema for instance with integer and boolean properties", function () {
        var instance = {
            "property1": false,
            "property2": 3
        };
        var schema = {
            "type": "object",
            "properties": {
                "property1": {
                    "type": "boolean"
                },
                "property2": {
                    "type": "integer"
                }
            },
            "additionalProperties": true,
            "required": ["property1", "property2"]
        };
        expect(SchemaGenerator.generateDefaultSchema(instance)).toEqual(schema);
    });

    it("generate schema for instance with float and string properties", function () {
        var instance = {
            "property1": 3.14,
            "property2": "value2"
        };
        var schema = {
            "type": "object",
            "properties": {
                "property1": {
                    "type": "number"
                },
                "property2": {
                    "type": "string"
                }
            },
            "additionalProperties": true,
            "required": ["property1", "property2"]
        };
        expect(SchemaGenerator.generateDefaultSchema(instance)).toEqual(schema);
    });

    it("generate schema for instance with float and null-valued properties", function () {
        var instance = {
            "property1": 3.14,
            "property2": null
        };
        var schema = {
            "type": "object",
            "properties": {
                "property1": {
                    "type": "number"
                },
                "property2": {
                    "type": "null"
                }
            },
            "additionalProperties": true,
            "required": ["property1", "property2"]
        };
        expect(SchemaGenerator.generateDefaultSchema(instance)).toEqual(schema);
    });

    it("generate schema for instance with primitive type array properties", function () {
        var instance = {
            "property1": [1, 2, 3],
            "property2": ["a", "b", "c"]
        };
        var schema = {
            "type": "object",
            "properties": {
                "property1": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "property2": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "additionalProperties": true,
            "required": ["property1", "property2"]
        };
        expect(SchemaGenerator.generateDefaultSchema(instance)).toEqual(schema);
    });

    it("generate schema for instance with object type array properties", function () {
        var instance = {
            "property1": [
                {"subproperty1": "value1", "subproperty2": [true, false]},
                {"subproperty1": "value2", "subproperty2": [false, true]},
            ],
            "property2": ["a", "b", "c"]
        };
        var schema = {
            "type": "object",
            "properties": {
                "property1": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "subproperty1": {
                                "type": "string"
                            },
                            "subproperty2": {
                                "type": "array",
                                "items": {
                                    "type": "boolean"
                                }
                            }
                        },
                        "additionalProperties": true,
                        "required": ["subproperty1", "subproperty2"]
                    }
                },
                "property2": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "additionalProperties": true,
            "required": ["property1", "property2"]
        };
        expect(SchemaGenerator.generateDefaultSchema(instance)).toEqual(schema);
    });

    it("generate schema for instance with primitive properties and object property", function () {
        var instance = {
            "property1": {
                "subproperty1": true,
                "subproperty2": "value1_2"
            },
            "property2": 3.14,
            "property3": {
                "subproperty1": "value3_1",
                "subproperty2": [false, false, true]
            }
        };
        var schema = {
            "type": "object",
            "properties": {
                "property1": {
                    "type": "object",
                    "properties": {
                        "subproperty1": {
                            "type": "boolean"
                        },
                        "subproperty2": {
                            "type": "string"
                        }
                    },
                    "additionalProperties": true,
                    "required": ["subproperty1", "subproperty2"]
                },
                "property2": {
                    "type": "number"
                },
                "property3": {
                    "type": "object",
                    "properties": {
                        "subproperty1": {
                            "type": "string"
                        },
                        "subproperty2": {
                            "type": "array",
                            "items": {
                                "type": "boolean"
                            }
                        }
                    },
                    "additionalProperties": true,
                    "required": ["subproperty1", "subproperty2"]
                }
            },
            "additionalProperties": true,
            "required": ["property1", "property2", "property3"]
        };
        expect(SchemaGenerator.generateDefaultSchema(instance)).toEqual(schema);
    });

});