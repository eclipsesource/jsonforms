import test from 'ava';

import { ControlElement, createLabelDescriptionFrom } from '@jsonforms/core';
import { translateLabel } from '../src';

test('control with label, with translation object', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {
      text: '%foo'
    }
  };
  const translationObject = {
    'foo': 'Foo'
  };
  const labelObject = createLabelDescriptionFrom(controlElement);
  t.is(translateLabel(translationObject, labelObject.text), 'Foo');
});

test('control with label, without translation object', t => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: {
      text: '%foo'
    }
  };
  const labelObject = createLabelDescriptionFrom(controlElement);
  t.is(translateLabel(undefined, labelObject.text), '%foo');
});
