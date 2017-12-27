import test from 'ava';

import { ControlElement } from '../src/models/uischema';
import { createLabelDescriptionFrom } from '../src/helpers/label';

test('control relative', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '/properties/foo'
    }
  };
  const labelObject = createLabelDescriptionFrom(controlElement);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo');
});

test('control without label string, camel split', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/fooBarBaz'
    }
  };
  const labelObject = createLabelDescriptionFrom(controlElement);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo Bar Baz');
});

test('control with label string', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    },
    label: 'bar'
  };
  const labelObject = createLabelDescriptionFrom(controlElement);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'bar');
});

test('control with label boolean', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    },
    label: true
  };
  const labelObject = createLabelDescriptionFrom(controlElement);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo');
});

test('control with label object, empty', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    },
    label: {}
  };
  const labelObject = createLabelDescriptionFrom(controlElement);
  t.is(labelObject.show, true);
  t.is(labelObject.text, 'Foo');
});

test('control with label object, text-only', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    },
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
    scope: {
      $ref: '#/properties/foo'
    },
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
    scope: {
      $ref: '#/properties/foo'
    },
    label: {
      show: false,
      text: 'mega bar'
    }
  };
  const labelObject = createLabelDescriptionFrom(controlElement);
  t.is(labelObject.show, false);
  t.is(labelObject.text, 'mega bar');
});
