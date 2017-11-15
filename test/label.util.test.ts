import test from 'ava';

import { JsonSchema } from '../src/models/jsonSchema';
import { ControlElement } from '../src/models/uischema';
import { getElementLabelObject } from '../src/renderers/label.util';

test('control relative', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                type: 'string'
            }
        }
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '/properties/foo'
        }
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});

test('control relative required', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: {
                type: 'string'
            }
        },
        required: ['foo']
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '/properties/foo'
        }
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});

test('control without label string', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {$ref: '#/properties/foo'}
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});

test('control without label string , required', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: {
                type: 'integer'
            }
        },
        required: ['foo']
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});

test('control without label string, camel split', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'fooBarBaz': {
                'type': 'integer'
            }
        }
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/fooBarBaz'
        }
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo Bar Baz');
});

test('control without label string, camel split and required', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            bazBarFoo: {
                type: 'integer'
            }
        },
        required: ['bazBarFoo']
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/bazBarFoo'
        }
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Baz Bar Foo');
});
test('control with label string', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: 'bar'
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'bar');
});
test('control with label string, required', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: {
                type: 'integer'
            }
        },
        required: ['foo']
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: 'bar'
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'bar');
});

test('control with label boolean', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: true
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});

test('control with label boolean, required', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: {
                type: 'integer'
            }
        },
        required: ['foo']
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: false
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, false);
    t.is(labelObject.text, 'Foo');
});

test('control with label object, empty', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: {}
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});

test('control with label object, empty and required', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: {
                type: 'integer'
            }
        },
        required: ['foo']
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: {}
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});

test('control with label object, text-only', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: {
            text: 'mega bar'
        }
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'mega bar');
});

test('control with label object, text-only and required', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: {
                'type': 'integer'
            }
        },
        required: ['foo']
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: {
            text: 'mega bar'
        }
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'mega bar');
});

test('control with label object, visible-only', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: {
            show: true
        }
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});

test('control with label object, visible-only and required', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: {
                type: 'integer'
            }
        },
        required: ['foo']
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {$ref: '#/properties/foo'},
        label: {
            show: false
        }
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, false);
    t.is(labelObject.text, 'Foo');
});

test('control with label object, full', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: {
            show: false,
            text: 'mega bar'
        }
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, false);
    t.is(labelObject.text, 'mega bar');
});

test('control with label object, full and required', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            foo: {
                type: 'integer'
            }
        },
        required: ['foo']
    };
    const controlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: {
            show: true,
            text: 'mega bar'}
    };
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'mega bar');
});
