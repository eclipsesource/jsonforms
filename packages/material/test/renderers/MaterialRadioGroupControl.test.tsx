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
import './MatchMediaMock';
import * as React from 'react';
import {
  Actions,
  ControlElement,
  isEnumControl,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  rankWith,
  UISchemaElement,
  update
} from '@jsonforms/core';
import MaterialRadioGroupControl from '../../src/controls/MaterialRadioGroupControl';
import { Provider } from 'react-redux';
import { materialRenderers } from '../../src';
import { AnyAction, combineReducers, createStore, Reducer, Store } from 'redux';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JsonFormsReduxContext } from '@jsonforms/react';
Enzyme.configure({ adapter: new Adapter() });

const data = { foo: 'D' };
const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      enum: ['A', 'B', 'C', 'D']
    }
  }
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};

const initJsonFormsStore = (
  testData: any,
  testSchema: JsonSchema,
  testUiSchema: UISchemaElement
): Store<JsonFormsState> => {
  const s: JsonFormsState = {
    jsonforms: {
      renderers: [
        ...materialRenderers,
        {
          tester: rankWith(10, isEnumControl),
          renderer: MaterialRadioGroupControl
        }
      ]
    }
  };
  const reducer: Reducer<JsonFormsState, AnyAction> = combineReducers({
    jsonforms: jsonformsReducer()
  });
  const store: Store<JsonFormsState> = createStore(reducer, s);
  store.dispatch(Actions.init(testData, testSchema, testUiSchema));
  return store;
};

describe('Material radio group control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should have option selected', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialRadioGroupControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );

    const radioButtons = wrapper.find('input[type="radio"]');
    const currentlyChecked = wrapper.find('input[type="radio"][checked=true]');
    expect(radioButtons.length).toBe(4);
    expect(currentlyChecked.first().props().value).toBe('D');
  });

  it('should have only update selected option ', () => {
    const store = initJsonFormsStore(data, schema, uischema);

    store.dispatch(update('foo', () => 'A'));
    store.dispatch(update('foo', () => 'B'));

    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialRadioGroupControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const currentlyChecked = wrapper.find('input[type="radio"][checked=true]');
    expect(currentlyChecked.length).toBe(1);
    expect(currentlyChecked.first().props().value).toBe('B');
  });

  it('should be hideable ', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialRadioGroupControl
            schema={schema}
            uischema={uischema}
            visible={false}
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    const radioButtons = wrapper.find('input[type="radio"]');
    expect(radioButtons.length).toBe(0);
  });
});
