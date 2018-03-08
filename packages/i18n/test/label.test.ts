/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
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
  t.is(defaultProps['momentLocale'], undefined);
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
  t.not(props.momentLocale, undefined);
});
