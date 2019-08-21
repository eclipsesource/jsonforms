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
import {
  Actions,
  ControlElement,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  NOT_APPLICABLE,
  UISchemaElement
} from '@jsonforms/core';
import * as React from 'react';
import { AnyAction, combineReducers, createStore, Reducer, Store } from 'redux';
import { materialRenderers } from '../../src';
import MaterialObjectRenderer, {
  materialObjectControlTester
} from '../../src/complex/MaterialObjectRenderer';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JsonFormsReduxContext } from '@jsonforms/react';
import { Provider } from 'react-redux';

Enzyme.configure({ adapter: new Adapter() });

const initJsonFormsStore = (
  testData: any,
  testSchema: JsonSchema,
  testUiSchema: UISchemaElement
): Store<JsonFormsState> => {
  const s: JsonFormsState = {
    jsonforms: {
      renderers: materialRenderers
    }
  };
  const reducer: Reducer<JsonFormsState, AnyAction> = combineReducers({
    jsonforms: jsonformsReducer()
  });
  const store: Store<JsonFormsState> = createStore(reducer, s);
  store.dispatch(Actions.init(testData, testSchema, testUiSchema));
  return store;
};

const data = { foo: { foo_1: 'foo' }, bar: { bar_1: 'bar' } };
const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'object',
      properties: {
        foo_1: { type: 'string' }
      }
    },
    bar: {
      type: 'object',
      properties: {
        bar_1: { type: 'string' }
      }
    }
  }
};
const uischema1: ControlElement = {
  type: 'Control',
  scope: '#'
};
const uischema2: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};

describe('Material object renderer tester', () => {
  test('should fail', () => {
    expect(materialObjectControlTester(undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialObjectControlTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialObjectControlTester({ type: 'Foo' }, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialObjectControlTester({ type: 'Control' }, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(
      materialObjectControlTester(uischema2, {
        type: 'object',
        properties: {
          foo: { type: 'string' }
        }
      })
    ).toBe(NOT_APPLICABLE);
    expect(
      materialObjectControlTester(uischema2, {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          bar: schema.properties.bar
        }
      })
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed', () => {
    expect(
      materialObjectControlTester(uischema2, {
        type: 'object',
        properties: {
          foo: schema.properties.foo
        }
      })
    ).toBe(2);
  });
});

describe('Material object control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render all children', () => {
    const store = initJsonFormsStore(data, schema, uischema1);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialObjectRenderer schema={schema} uischema={uischema1} />
        </JsonFormsReduxContext>
      </Provider>
    );

    const inputs = wrapper.find('input');
    expect(inputs.length).toBe(2);
    expect(inputs.at(0).props().type).toBe('text');
    expect(inputs.at(0).props().value).toBe('foo');
    expect(inputs.at(1).props().type).toBe('text');
    expect(inputs.at(1).props().value).toBe('bar');
  });

  it('should render only itself', () => {
    const store = initJsonFormsStore(data, schema, uischema1);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialObjectRenderer schema={schema} uischema={uischema2} />
        </JsonFormsReduxContext>
      </Provider>
    );

    const inputs = wrapper.find('input');
    expect(inputs.length).toBe(1);
    expect(inputs.at(0).props().type).toBe('text');
    expect(inputs.at(0).props().value).toBe('foo');
  });

  it('should be enabled by default', () => {
    const store = initJsonFormsStore(data, schema, uischema2);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialObjectRenderer schema={schema} uischema={uischema2} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const inputs = wrapper.find('input');
    expect(inputs.first().props().disabled).toBeFalsy();
  });

  it('can be invisible', () => {
    const store = initJsonFormsStore(data, schema, uischema2);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialObjectRenderer
            schema={schema}
            uischema={uischema2}
            visible={false}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const inputs = wrapper.find('input');
    expect(inputs.length).toBe(0);
  });

  it('should be visible by default', () => {
    const store = initJsonFormsStore(data, schema, uischema2);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialObjectRenderer schema={schema} uischema={uischema2} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const inputs = wrapper.find('input');
    expect(inputs.first().props().hidden).toBeFalsy();
  });
});
