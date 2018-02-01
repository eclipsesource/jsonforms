import test from 'ava';

import {
  ControlElement,
  createLabelDescriptionFrom,
  mapStateToControlProps
} from '@jsonforms/core';
import { translateLabel, translateProps } from '../src';

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

test('mapStateToControlProps', t => {
  const coreUISchema = {
    type: 'Control',
    scope: '#/properties/firstName',
  };
  const ownProps = {
    uischema: coreUISchema
  };
  const defaultState = {
    jsonforms: {
      core: { },
      i18n: { }
    }
  };
  const defaultProps = mapStateToControlProps(defaultState, ownProps);
  // tslint:disable:no-string-literal
  t.is(defaultProps['locale'], undefined);
  t.is(defaultProps['localLocale'], undefined);
  // tslint:enable:no-string-literal

  const state = {
    jsonforms: {
      core: { },
      i18n: {
        locale: 'de-DE'
      }
    }
  };
  const props = translateProps(state, mapStateToControlProps(state, ownProps));
  t.is(props.locale, 'de-DE');
  t.not(props.localLocale, undefined);
});
