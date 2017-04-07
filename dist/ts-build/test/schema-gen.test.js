"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var schema_gen_1 = require("../src/generators/schema-gen");
ava_1.default('default schema generation basic types', function (t) {
    var instance = { boolean: false, number: 3.14, integer: 3, string: 'PI', null: null,
        undefined: undefined };
    var schema = schema_gen_1.generateJsonSchema(instance);
    // FIXME: Should a property be generated for properties with undefined?
    t.deepEqual(schema, {
        'type': 'object',
        'properties': {
            'boolean': {
                'type': 'boolean'
            },
            'number': {
                'type': 'number'
            },
            'integer': {
                'type': 'integer'
            },
            'string': {
                'type': 'string'
            },
            'null': {
                'type': 'null'
            },
            'undefined': {}
        },
        'additionalProperties': true,
        'required': [
            'boolean', 'number', 'integer', 'string', 'null', 'undefined'
        ]
    });
});
ava_1.default('default schema generation array types', function (t) {
    var instance = { emptyArray: [], booleanArray: [false, false], numberArray: [3.14, 2.71],
        integerArray: [3, 2], stringArray: ['PI', 'e'], nullArray: [null, null] };
    var schema = schema_gen_1.generateJsonSchema(instance);
    t.deepEqual(schema, {
        'type': 'object',
        'properties': {
            'emptyArray': {
                'type': 'array',
                'items': {}
            },
            'booleanArray': {
                'type': 'array',
                'items': { 'type': 'boolean' }
            },
            'numberArray': {
                'type': 'array',
                'items': { 'type': 'number' }
            },
            'integerArray': {
                'type': 'array',
                'items': { 'type': 'integer' }
            },
            'stringArray': {
                'type': 'array',
                'items': { 'type': 'string' }
            },
            'nullArray': {
                'type': 'array',
                'items': { 'type': 'null' }
            }
        },
        'additionalProperties': true,
        'required': [
            'emptyArray', 'booleanArray', 'numberArray', 'integerArray', 'stringArray', 'nullArray'
        ]
    });
});
ava_1.default.failing('default schema generation tuple array types', function (t) {
    var instance = { tupleArray: [3.14, 'PI'] };
    var schema = schema_gen_1.generateJsonSchema(instance);
    // FIXME: This assumption is the correct one, but we crteate a oneOf in this case
    t.deepEqual(schema, {
        'type': 'object',
        'properties': {
            'tupleArray': {
                'type': 'array',
                'items': [
                    { 'type': 'number' },
                    { 'type': 'string' }
                ]
            }
        },
        'additionalProperties': true,
        'required': [
            'tupleArray'
        ]
    });
});
ava_1.default('default schema generation ', function (t) {
    var instance = {
        'address': {
            'streetAddress': '21 2nd Street',
            'city': 'New York'
        },
        'phoneNumber': [
            {
                'location': 'home',
                'code': 44,
                'private': true
            }
        ]
    };
    var schema = schema_gen_1.generateJsonSchema(instance);
    t.deepEqual(schema, {
        'type': 'object',
        'properties': {
            'address': {
                'type': 'object',
                'properties': {
                    'streetAddress': {
                        'type': 'string'
                    },
                    'city': {
                        'type': 'string'
                    }
                },
                'additionalProperties': true,
                'required': [
                    'streetAddress',
                    'city'
                ]
            },
            'phoneNumber': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'location': {
                            'type': 'string'
                        },
                        'code': {
                            'type': 'integer'
                        },
                        'private': {
                            'type': 'boolean'
                        }
                    },
                    'additionalProperties': true,
                    'required': [
                        'location',
                        'code',
                        'private'
                    ]
                }
            }
        },
        'additionalProperties': true,
        'required': [
            'address',
            'phoneNumber'
        ]
    });
});
ava_1.default('schema generation with options ', function (t) {
    var instance = {
        'address': {
            'streetAddress': '21 2nd Street',
            'city': 'New York'
        }
    };
    var schema = schema_gen_1.generateJsonSchema(instance, {
        'additionalProperties': false,
        'required': function (props) {
            var keys = Object.keys(props);
            if (props !== undefined && keys.length) {
                return [keys[0]];
            }
            else {
                return [];
            }
        }
    });
    t.deepEqual(schema, {
        'type': 'object',
        'properties': {
            'address': {
                'type': 'object',
                'properties': {
                    'streetAddress': {
                        'type': 'string'
                    },
                    'city': {
                        'type': 'string'
                    }
                },
                'additionalProperties': false,
                'required': ['streetAddress']
            }
        },
        'additionalProperties': false,
        'required': ['address']
    });
});
//# sourceMappingURL=schema-gen.test.js.map