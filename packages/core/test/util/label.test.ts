/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import test from 'ava';

import { ControlElement } from '../../src';
import { createLabelDescriptionFrom } from '../../src/util';
import { JsonSchema } from '../../src/models/jsonSchema';

test('control relative - no schema', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '/properties/foo',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, undefined);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo');
});

test('control without label string, camel split - no schema', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/fooBarBaz',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, undefined);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo Bar Baz');
});

test('control with label string - no schema', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: 'bar',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, undefined);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'bar');
});

test('control with label boolean - no schema', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: true,
  };
  const labelObject = createLabelDescriptionFrom(controlElement, undefined);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo');
});

test('control with label object, empty - no schema', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {},
  };
  const labelObject = createLabelDescriptionFrom(controlElement, undefined);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo');
});

test('control with label object, text-only - no schema', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {
      text: 'mega bar',
    },
  };
  const labelObject = createLabelDescriptionFrom(controlElement, undefined);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'mega bar');
});

test('control with label object, visible-only - no schema', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {
      show: true,
    },
  };
  const labelObject = createLabelDescriptionFrom(controlElement, undefined);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo');
});

test('control with label object, full - no schema', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {
      show: false,
      text: 'mega bar',
    },
  };
  const labelObject = createLabelDescriptionFrom(controlElement, undefined);
  t.is(labelObject.show, false);
  t.is(labelObject.text, 'mega bar');
});

test('control relative - schema without title', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '/properties/foo',
  };
  const schema: JsonSchema = {
    type: 'string',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, schema);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo');
});

test('control without label string, camel split - schema without title', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/fooBarBaz',
  };
  const schema: JsonSchema = {
    type: 'string',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, schema);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo Bar Baz');
});

test('control with label string - schema without title', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: 'bar',
  };
  const schema: JsonSchema = {
    type: 'string',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, schema);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'bar');
});

test('control with label boolean - schema without title', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: true,
  };
  const schema: JsonSchema = {
    type: 'string',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, schema);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo');
});

test('control with label object, empty - schema without title', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {},
  };
  const schema: JsonSchema = {
    type: 'string',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, schema);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo');
});

test('control with label object, text-only - schema without title', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {
      text: 'mega bar',
    },
  };
  const schema: JsonSchema = {
    type: 'string',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, schema);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'mega bar');
});

test('control with label object, visible-only - schema without title', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {
      show: true,
    },
  };
  const schema: JsonSchema = {
    type: 'string',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, schema);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo');
});

test('control with label object, full - schema without title', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {
      show: false,
      text: 'mega bar',
    },
  };
  const schema: JsonSchema = {
    type: 'string',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, schema);
  t.is(labelObject.show, false);
  t.is(labelObject.text, 'mega bar');
});

test('control relative - schema with title', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '/properties/foo',
  };
  const schema: JsonSchema = {
    type: 'string',
    title: 'Schema Title',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, schema);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Schema Title');
});

test('control without label string, camel split - schema with title', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/fooBarBaz',
  };
  const schema: JsonSchema = {
    type: 'string',
    title: 'Schema Title',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, schema);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Schema Title');
});

test('control with label string - schema with title', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: 'bar',
  };
  const schema: JsonSchema = {
    type: 'string',
    title: 'Schema Title',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, schema);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'bar');
});

test('control with label boolean - schema with title', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: true,
  };
  const schema: JsonSchema = {
    type: 'string',
    title: 'Schema Title',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, schema);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Schema Title');
});

test('control with label object, empty - schema with title', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {},
  };
  const schema: JsonSchema = {
    type: 'string',
    title: 'Schema Title',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, schema);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Schema Title');
});

test('control with label object, text-only - schema with title', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {
      text: 'mega bar',
    },
  };
  const schema: JsonSchema = {
    type: 'string',
    title: 'Schema Title',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, schema);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'mega bar');
});

test('control with label object, visible-only - schema with title', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {
      show: true,
    },
  };
  const schema: JsonSchema = {
    type: 'string',
    title: 'Schema Title',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, schema);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Schema Title');
});

test('control with label object, full - schema with title', (t) => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {
      show: false,
      text: 'mega bar',
    },
  };
  const schema: JsonSchema = {
    type: 'string',
    title: 'Schema Title',
  };
  const labelObject = createLabelDescriptionFrom(controlElement, schema);
  t.is(labelObject.show, false);
  t.is(labelObject.text, 'mega bar');
});
