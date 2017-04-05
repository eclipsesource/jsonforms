import test from 'ava';

import {getElementLabelObject, startCase} from '../src/renderers/label.util';
import {JsonSchema } from '../src/models/jsonSchema';
import {ControlElement } from '../src/models/uischema';

test('startCase', t => {
    t.is(startCase('name'), 'Name');
    t.is(startCase('fooBar'), 'Foo Bar');
    t.is(startCase(''), '');
    t.is(startCase(null), '');
    t.is(startCase(undefined), '');
});

test('control relative', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
          'foo': {
            type: 'string'
          }
        }
    } as JsonSchema;
    const controlElement = {type: 'ControlElement',
    scope: {$ref: '/properties/foo'}} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});
test('control relative required', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
          'foo': {
            type: 'string'
          }
        },
        required: ['foo']
    } as JsonSchema;
    const controlElement = {type: 'ControlElement',
    scope: {$ref: '/properties/foo'}} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo*');
});

test('control without label string', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    } as JsonSchema;
    const controlElement = {type: 'ControlElement',
    scope: {$ref: '#/properties/foo'}} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});
test('control without label string , required', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        },
        required: ['foo']
    } as JsonSchema;
    const controlElement = {type: 'ControlElement',
    scope: {$ref: '#/properties/foo'}} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo*');
});
test('control without label string, camel split', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'fooBarBaz': {
                'type': 'integer'
            }
        }
    } as JsonSchema;
    const controlElement = {type: 'ControlElement',
    scope: {$ref: '#/properties/fooBarBaz'}} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo Bar Baz');
});
test('control without label string, camel split and required', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'bazBarFoo': {
                'type': 'integer'
            }
        },
        required: ['bazBarFoo']
    } as JsonSchema;
    const controlElement = {type: 'ControlElement',
    scope: {$ref: '#/properties/bazBarFoo'}} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Baz Bar Foo*');
});
test('control with label string', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    } as JsonSchema;
    const controlElement = {type: 'ControlElement', scope: {$ref: '#/properties/foo'},
      label: 'bar'} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'bar');
});
test('control with label string, required', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        },
        required: ['foo']
    } as JsonSchema;
    const controlElement = {type: 'ControlElement', scope: {$ref: '#/properties/foo'},
      label: 'bar'} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'bar*');
});
test('control with label boolean', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    } as JsonSchema;
    const controlElement = {type: 'ControlElement', scope: {$ref: '#/properties/foo'},
      label: true} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});
test('control with label boolean, required', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        },
        required: ['foo']
    } as JsonSchema;
    const controlElement = {type: 'ControlElement', scope: {$ref: '#/properties/foo'},
      label: false} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, false);
    t.is(labelObject.text, 'Foo*');
});
test('control with label object, empty', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    } as JsonSchema;
    const controlElement = {type: 'ControlElement', scope: {$ref: '#/properties/foo'},
      label: {}} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});
test('control with label object, empty and required', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        },
        required: ['foo']
    } as JsonSchema;
    const controlElement = {type: 'ControlElement', scope: {$ref: '#/properties/foo'},
      label: {}} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo*');
});
test('control with label object, text-only', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    } as JsonSchema;
    const controlElement = {type: 'ControlElement', scope: {$ref: '#/properties/foo'},
      label: {text: 'mega bar'}} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'mega bar');
});
test('control with label object, text-only and required', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        },
        required: ['foo']
    } as JsonSchema;
    const controlElement = {type: 'ControlElement', scope: {$ref: '#/properties/foo'},
      label: {text: 'mega bar'}} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'mega bar*');
});
test('control with label object, visible-only', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    } as JsonSchema;
    const controlElement = {type: 'ControlElement', scope: {$ref: '#/properties/foo'},
      label: {show: true}} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});
test('control with label object, visible-only and required', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        },
        required: ['foo']
    } as JsonSchema;
    const controlElement = {type: 'ControlElement', scope: {$ref: '#/properties/foo'},
      label: {show: false}} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, false);
    t.is(labelObject.text, 'Foo*');
});
test('control with label object, full', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    } as JsonSchema;
    const controlElement = {type: 'ControlElement', scope: {$ref: '#/properties/foo'},
      label: {show: false, text: 'mega bar'}} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, false);
    t.is(labelObject.text, 'mega bar');
});
test('control with label object, full and required', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        },
        required: ['foo']
    } as JsonSchema;
    const controlElement = {type: 'ControlElement', scope: {$ref: '#/properties/foo'},
      label: {show: true, text: 'mega bar'}} as ControlElement;
    const labelObject = getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'mega bar*');
});
