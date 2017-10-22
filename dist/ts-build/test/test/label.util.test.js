"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const label_util_1 = require("../src/renderers/label.util");
ava_1.default('control relative', t => {
    const schema = {
        'type': 'object',
        'properties': {
            'foo': {
                type: 'string'
            }
        }
    };
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '/properties/foo'
        }
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});
ava_1.default('control relative required', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'string'
            }
        },
        required: ['foo']
    };
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '/properties/foo'
        }
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo*');
});
ava_1.default('control without label string', t => {
    const schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    const controlElement = {
        type: 'Control',
        scope: { $ref: '#/properties/foo' }
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});
ava_1.default('control without label string , required', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'integer'
            }
        },
        required: ['foo']
    };
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo*');
});
ava_1.default('control without label string, camel split', t => {
    const schema = {
        'type': 'object',
        'properties': {
            'fooBarBaz': {
                'type': 'integer'
            }
        }
    };
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/fooBarBaz'
        }
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo Bar Baz');
});
ava_1.default('control without label string, camel split and required', t => {
    const schema = {
        type: 'object',
        properties: {
            bazBarFoo: {
                type: 'integer'
            }
        },
        required: ['bazBarFoo']
    };
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/bazBarFoo'
        }
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Baz Bar Foo*');
});
ava_1.default('control with label string', t => {
    const schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: 'bar'
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'bar');
});
ava_1.default('control with label string, required', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'integer'
            }
        },
        required: ['foo']
    };
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: 'bar'
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'bar*');
});
ava_1.default('control with label boolean', t => {
    const schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: true
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});
ava_1.default('control with label boolean, required', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'integer'
            }
        },
        required: ['foo']
    };
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: false
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, false);
    t.is(labelObject.text, 'Foo*');
});
ava_1.default('control with label object, empty', t => {
    const schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: {}
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});
ava_1.default('control with label object, empty and required', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'integer'
            }
        },
        required: ['foo']
    };
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: {}
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo*');
});
ava_1.default('control with label object, text-only', t => {
    const schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: {
            text: 'mega bar'
        }
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'mega bar');
});
ava_1.default('control with label object, text-only and required', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: {
                'type': 'integer'
            }
        },
        required: ['foo']
    };
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: {
            text: 'mega bar'
        }
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'mega bar*');
});
ava_1.default('control with label object, visible-only', t => {
    const schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: {
            show: true
        }
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});
ava_1.default('control with label object, visible-only and required', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'integer'
            }
        },
        required: ['foo']
    };
    const controlElement = {
        type: 'Control',
        scope: { $ref: '#/properties/foo' },
        label: {
            show: false
        }
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, false);
    t.is(labelObject.text, 'Foo*');
});
ava_1.default('control with label object, full', t => {
    const schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: {
            show: false,
            text: 'mega bar'
        }
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, false);
    t.is(labelObject.text, 'mega bar');
});
ava_1.default('control with label object, full and required', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'integer'
            }
        },
        required: ['foo']
    };
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: {
            show: true,
            text: 'mega bar'
        }
    };
    const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'mega bar*');
});
//# sourceMappingURL=label.util.test.js.map