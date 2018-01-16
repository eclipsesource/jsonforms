import test from 'ava';

import { ControlElement } from '../../src';
import { createLabelDescriptionFrom, translateLabel } from '../../src/util';

test('control relative', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '/properties/foo'
  };
  const labelObject = createLabelDescriptionFrom(controlElement);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo');
});

test('control without label string, camel split', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/fooBarBaz'
  };
  const labelObject = createLabelDescriptionFrom(controlElement);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo Bar Baz');
});

test('control with label string', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: 'bar'
  };
  const labelObject = createLabelDescriptionFrom(controlElement);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'bar');
});

test('control with label boolean', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: true
  };
  const labelObject = createLabelDescriptionFrom(controlElement);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo');
});

test('control with label object, empty', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {}
  };
  const labelObject = createLabelDescriptionFrom(controlElement);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo');
});

test('control with label object, text-only', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {
      text: 'mega bar'
    }
  };
  const labelObject = createLabelDescriptionFrom(controlElement);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'mega bar');
});

test('control with label object, visible-only', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {
      show: true
    }
  };
  const labelObject = createLabelDescriptionFrom(controlElement);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo');
});

test('control with label object, full', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {
      show: false,
      text: 'mega bar'
    }
  };
  const labelObject = createLabelDescriptionFrom(controlElement);
  t.is(labelObject.show, false);
  t.is(labelObject.text, 'mega bar');
});

test('control with label, with translation object', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    },
    label: {
      text: '%foo'
    }
  };
  const translationObject = {
    'foo': 'Foo'
  };
  let labelObject = createLabelDescriptionFrom(controlElement);
  labelObject = translateLabel(translationObject, labelObject);
  t.is(labelObject.text, 'Foo');
});

test('control with label, without translation object', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    },
    label: {
      text: '%foo'
    }
  };
  let labelObject = createLabelDescriptionFrom(controlElement);
  labelObject = translateLabel(undefined, labelObject);
  t.is(labelObject.text, '%foo');
});
