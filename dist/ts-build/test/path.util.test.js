"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var path_util_1 = require("../src/path.util");
ava_1.default('resolve ', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    t.deepEqual(path_util_1.resolveSchema(schema, '#/properties/foo'), {
        type: 'integer'
    });
});
ava_1.default('toDataPath ', function (t) {
    t.is(path_util_1.toDataPath('#/properties/foo/properties/bar'), 'foo/bar');
});
ava_1.default('toDataPath use of keywords', function (t) {
    t.is(path_util_1.toDataPath('#/properties/properties'), 'properties');
});
ava_1.default('toDataPath use of encoded paths', function (t) {
    var fooBar = encodeURIComponent('foo/bar');
    t.is(path_util_1.toDataPath("#/properties/" + fooBar), "" + fooBar);
});
ava_1.default('toDataPath relative with /', function (t) {
    t.is(path_util_1.toDataPath('/properties/foo/properties/bar'), 'foo/bar');
});
ava_1.default('toDataPath use of keywords relative with /', function (t) {
    t.is(path_util_1.toDataPath('/properties/properties'), 'properties');
});
ava_1.default('toDataPath use of encoded paths relative with /', function (t) {
    var fooBar = encodeURIComponent('foo/bar');
    t.is(path_util_1.toDataPath("/properties/" + fooBar), "" + fooBar);
});
ava_1.default('toDataPath relative without /', function (t) {
    t.is(path_util_1.toDataPath('properties/foo/properties/bar'), 'foo/bar');
});
ava_1.default('toDataPath use of keywords relative without /', function (t) {
    t.is(path_util_1.toDataPath('properties/properties'), 'properties');
});
ava_1.default('toDataPath use of encoded paths relative without /', function (t) {
    var fooBar = encodeURIComponent('foo/bar');
    t.is(path_util_1.toDataPath("properties/" + fooBar), "" + fooBar);
});
ava_1.default('resolve instance', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    var instance = { foo: 123 };
    var result = path_util_1.getValuePropertyPair(instance, '#/properties/foo');
    t.is(result.instance, instance);
    t.is(result.property, 'foo');
});
ava_1.default('resolve instance with keywords', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'properties': {
                'type': 'integer'
            }
        }
    };
    var instance = { properties: 123 };
    var result = path_util_1.getValuePropertyPair(instance, '#/properties/properties');
    t.is(result.instance, instance);
    t.is(result.property, 'properties');
    t.is(result.instance[result.property], 123);
});
ava_1.default('resolve instance with encoded', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo/bar': {
                'type': 'integer'
            }
        }
    };
    var instance = { 'foo/bar': 123 };
    var fooBar = encodeURIComponent('foo/bar');
    var result = path_util_1.getValuePropertyPair(instance, "#/properties/" + fooBar);
    t.is(result.instance, instance);
    t.is(result.property, 'foo/bar');
    t.is(result.instance[result.property], 123);
});
ava_1.default('resolve nested instance', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'object',
                'properties': {
                    'bar': {
                        'type': 'integer'
                    }
                }
            }
        }
    };
    var instance = { foo: { bar: 123 } };
    var result = path_util_1.getValuePropertyPair(instance, '#/properties/foo/properties/bar');
    t.is(result.instance, instance.foo);
    t.is(result.property, 'bar');
});
ava_1.default('resolve uninitiated instance', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'object',
                'properties': {
                    'bar': {
                        'type': 'integer'
                    }
                }
            }
        }
    };
    var instance = {};
    var result = path_util_1.getValuePropertyPair(instance, '#/properties/foo/properties/bar');
    t.deepEqual(result.instance, {});
    t.is(result.property, 'bar');
});
ava_1.default('resolve $ref', function (t) {
    var schema = {
        definitions: {
            foo: {
                type: 'string'
            }
        },
        type: 'object',
        properties: {
            foos: {
                type: 'array',
                items: {
                    $ref: '#/definitions/foo'
                }
            }
        }
    };
    var result = path_util_1.resolveSchema(schema, '#/properties/foos/items');
    t.deepEqual(result, { type: 'string' });
});
ava_1.default.failing('resolve $ref simple', function (t) {
    var schema = {
        definitions: {
            foo: {
                type: 'object',
                properties: {
                    bar: {
                        type: 'array',
                        items: {
                            $ref: '#/definitions/foo'
                        }
                    }
                }
            }
        },
        type: 'object',
        properties: {
            foos: {
                type: 'array',
                items: {
                    $ref: '#/definitions/foo'
                }
            }
        }
    };
    var result = path_util_1.resolveSchema(schema, '#/properties/foos/items');
    t.deepEqual(result, {
        type: 'object',
        properties: {
            bar: {
                type: 'array',
                items: {
                    $ref: '#'
                }
            }
        }
    });
    t.not(schema.definitions.foo.properties.bar.items.$ref, '#');
});
ava_1.default.failing('resolve $ref complicated', function (t) {
    var schema = {
        definitions: {
            foo: {
                type: 'object',
                properties: {
                    bar: {
                        type: 'array',
                        items: {
                            $ref: '#/definitions/foo2'
                        }
                    }
                }
            },
            foo2: {
                type: 'object',
                properties: {
                    bar: {
                        type: 'array',
                        items: {
                            $ref: '#/definitions/foo'
                        }
                    }
                }
            }
        },
        type: 'object',
        properties: {
            foos: {
                type: 'array',
                items: {
                    $ref: '#/definitions/foo'
                }
            }
        }
    };
    var result = path_util_1.resolveSchema(schema, '#/properties/foos/items');
    t.deepEqual(result, {
        definitions: {
            foo2: {
                type: 'object',
                properties: {
                    bar: {
                        type: 'array',
                        items: {
                            $ref: '#'
                        }
                    }
                }
            }
        },
        type: 'object',
        properties: {
            bar: {
                type: 'array',
                items: {
                    $ref: '#/definitions/foo2'
                }
            }
        }
    });
});
//# sourceMappingURL=path.util.test.js.map