"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var label_util_1 = require("../src/renderers/label.util");
ava_1.default('startCase', function (t) {
    t.is(label_util_1.startCase('name'), 'Name');
    t.is(label_util_1.startCase('fooBar'), 'Foo Bar');
    t.is(label_util_1.startCase(''), '');
    t.is(label_util_1.startCase(null), '');
    t.is(label_util_1.startCase(undefined), '');
});
ava_1.default('control relative', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                type: 'string'
            }
        }
    };
    var controlElement = { type: 'ControlElement',
        scope: { $ref: '/properties/foo' } };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});
ava_1.default('control relative required', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                type: 'string'
            }
        },
        required: ['foo']
    };
    var controlElement = { type: 'ControlElement',
        scope: { $ref: '/properties/foo' } };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo*');
});
ava_1.default('control without label string', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    var controlElement = { type: 'ControlElement',
        scope: { $ref: '#/properties/foo' } };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});
ava_1.default('control without label string , required', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        },
        required: ['foo']
    };
    var controlElement = { type: 'ControlElement',
        scope: { $ref: '#/properties/foo' } };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo*');
});
ava_1.default('control without label string, camel split', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'fooBarBaz': {
                'type': 'integer'
            }
        }
    };
    var controlElement = { type: 'ControlElement',
        scope: { $ref: '#/properties/fooBarBaz' } };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo Bar Baz');
});
ava_1.default('control without label string, camel split and required', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'bazBarFoo': {
                'type': 'integer'
            }
        },
        required: ['bazBarFoo']
    };
    var controlElement = { type: 'ControlElement',
        scope: { $ref: '#/properties/bazBarFoo' } };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Baz Bar Foo*');
});
ava_1.default('control with label string', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    var controlElement = { type: 'ControlElement', scope: { $ref: '#/properties/foo' },
        label: 'bar' };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'bar');
});
ava_1.default('control with label string, required', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        },
        required: ['foo']
    };
    var controlElement = { type: 'ControlElement', scope: { $ref: '#/properties/foo' },
        label: 'bar' };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'bar*');
});
ava_1.default('control with label boolean', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    var controlElement = { type: 'ControlElement', scope: { $ref: '#/properties/foo' },
        label: true };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});
ava_1.default('control with label boolean, required', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        },
        required: ['foo']
    };
    var controlElement = { type: 'ControlElement', scope: { $ref: '#/properties/foo' },
        label: false };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, false);
    t.is(labelObject.text, 'Foo*');
});
ava_1.default('control with label object, empty', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    var controlElement = { type: 'ControlElement', scope: { $ref: '#/properties/foo' },
        label: {} };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});
ava_1.default('control with label object, empty and required', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        },
        required: ['foo']
    };
    var controlElement = { type: 'ControlElement', scope: { $ref: '#/properties/foo' },
        label: {} };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo*');
});
ava_1.default('control with label object, text-only', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    var controlElement = { type: 'ControlElement', scope: { $ref: '#/properties/foo' },
        label: { text: 'mega bar' } };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'mega bar');
});
ava_1.default('control with label object, text-only and required', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        },
        required: ['foo']
    };
    var controlElement = { type: 'ControlElement', scope: { $ref: '#/properties/foo' },
        label: { text: 'mega bar' } };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'mega bar*');
});
ava_1.default('control with label object, visible-only', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    var controlElement = { type: 'ControlElement', scope: { $ref: '#/properties/foo' },
        label: { show: true } };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'Foo');
});
ava_1.default('control with label object, visible-only and required', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        },
        required: ['foo']
    };
    var controlElement = { type: 'ControlElement', scope: { $ref: '#/properties/foo' },
        label: { show: false } };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, false);
    t.is(labelObject.text, 'Foo*');
});
ava_1.default('control with label object, full', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    };
    var controlElement = { type: 'ControlElement', scope: { $ref: '#/properties/foo' },
        label: { show: false, text: 'mega bar' } };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, false);
    t.is(labelObject.text, 'mega bar');
});
ava_1.default('control with label object, full and required', function (t) {
    var schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        },
        required: ['foo']
    };
    var controlElement = { type: 'ControlElement', scope: { $ref: '#/properties/foo' },
        label: { show: true, text: 'mega bar' } };
    var labelObject = label_util_1.getElementLabelObject(schema, controlElement);
    t.is(labelObject.show, true);
    t.is(labelObject.text, 'mega bar*');
});
//# sourceMappingURL=label.util.test.js.map