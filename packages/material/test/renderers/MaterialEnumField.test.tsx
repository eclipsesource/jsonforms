/*
  The MIT License

  Copyright (c) 2018-2019 EclipseSource Munich
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
import * as React from 'react';
import {
  Actions,
  ControlElement,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  UISchemaElement
} from '@jsonforms/core';
import MaterialEnumField, { materialEnumFieldTester } from '../../src/fields/MaterialEnumField';
import { Provider } from 'react-redux';
import { materialFields, materialRenderers } from '../../src';
import { combineReducers, createStore, Store } from 'redux';

import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const data =  { nationality: 'JP'};
const schema = {
  type: 'string',
  enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
};
const uischema = {
  type: 'Control',
  scope: '#/properties/nationality'
};

const initJsonFormsStore = (testData: any, testSchema: JsonSchema, testUiSchema: UISchemaElement): Store<JsonFormsState> => {
  const s: JsonFormsState = {
    jsonforms: {
      renderers: materialRenderers,
        fields: materialFields,
    }
  };
  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    s
  );
  store.dispatch(Actions.init(testData, testSchema, testUiSchema));
  return store;
};

describe('Material enum field tester', () => {

  it('should succeed with matching prop type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/nationality'
    };
    expect(
      materialEnumFieldTester(
        control,
        {
          type: 'object',
          properties: {
            nationality: {
              type: 'string',
              enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
            }
          }
        }
      )
    ).toBe(2);
  });
});

describe('Material enum field', () => {
  it('should select an item from dropdown list', () =>  {
    const store = initJsonFormsStore(data, schema, uischema);
    const wrapper = mount(
      <Provider store={store}>
        <MaterialEnumField
          schema={schema}
          uischema={uischema}
          path='nationality'
        />
      </Provider>
    );
    const input = wrapper.find('input');
    expect(input.props().value).toBe('JP');
  });
});
