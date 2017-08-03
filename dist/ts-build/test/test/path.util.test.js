"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const path_util_1 = require("../src/path.util");
ava_1.default('resolve ', t => {
    const schema = {
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
ava_1.default('toDataPath ', t => {
    t.is(path_util_1.toDataPath('#/properties/foo/properties/bar'), 'foo/bar');
});
ava_1.default('toDataPath use of keywords', t => {
    t.is(path_util_1.toDataPath('#/properties/properties'), 'properties');
});
ava_1.default('toDataPath use of encoded paths', t => {
    const fooBar = encodeURIComponent('foo/bar');
    t.is(path_util_1.toDataPath(`#/properties/${fooBar}`), `${fooBar}`);
});
ava_1.default('toDataPath relative with /', t => {
    t.is(path_util_1.toDataPath('/properties/foo/properties/bar'), 'foo/bar');
});
ava_1.default('toDataPath use of keywords relative with /', t => {
    t.is(path_util_1.toDataPath('/properties/properties'), 'properties');
});
ava_1.default('toDataPath use of encoded paths relative with /', t => {
    const fooBar = encodeURIComponent('foo/bar');
    t.is(path_util_1.toDataPath(`/properties/${fooBar}`), `${fooBar}`);
});
ava_1.default('toDataPath relative without /', t => {
    t.is(path_util_1.toDataPath('properties/foo/properties/bar'), 'foo/bar');
});
ava_1.default('toDataPath use of keywords relative without /', t => {
    t.is(path_util_1.toDataPath('properties/properties'), 'properties');
});
ava_1.default('toDataPath use of encoded paths relative without /', t => {
    const fooBar = encodeURIComponent('foo/bar');
    t.is(path_util_1.toDataPath(`properties/${fooBar}`), `${fooBar}`);
});
ava_1.default('resolve instance', t => {
    const instance = { foo: 123 };
    const result = path_util_1.getValuePropertyPair(instance, '#/properties/foo');
    t.is(result.instance, instance);
    t.is(result.property, 'foo');
});
ava_1.default('resolve instance with keywords', t => {
    const instance = { properties: 123 };
    const result = path_util_1.getValuePropertyPair(instance, '#/properties/properties');
    t.is(result.instance, instance);
    t.is(result.property, 'properties');
    t.is(result.instance[result.property], 123);
});
ava_1.default('resolve instance with encoded', t => {
    const instance = { 'foo/bar': 123 };
    const fooBar = encodeURIComponent('foo/bar');
    const result = path_util_1.getValuePropertyPair(instance, `#/properties/${fooBar}`);
    t.is(result.instance, instance);
    t.is(result.property, 'foo/bar');
    t.is(result.instance[result.property], 123);
});
ava_1.default('resolve nested instance', t => {
    const instance = { foo: { bar: 123 } };
    const result = path_util_1.getValuePropertyPair(instance, '#/properties/foo/properties/bar');
    t.is(result.instance, instance.foo);
    t.is(result.property, 'bar');
});
ava_1.default('resolve uninitiated instance', t => {
    const instance = {};
    const result = path_util_1.getValuePropertyPair(instance, '#/properties/foo/properties/bar');
    t.deepEqual(result.instance, {});
    t.is(result.property, 'bar');
});
ava_1.default('resolve $ref', t => {
    const schema = {
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
    const result = path_util_1.resolveSchema(schema, '#/properties/foos/items');
    t.deepEqual(result, { type: 'string' });
});
ava_1.default.failing('resolve $ref simple', t => {
    const schema = {
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
    const result = path_util_1.resolveSchema(schema, '#/properties/foos/items');
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
ava_1.default.failing('resolve $ref complicated', t => {
    const schema = {
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
    const result = path_util_1.resolveSchema(schema, '#/properties/foos/items');
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