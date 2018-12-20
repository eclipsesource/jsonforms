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
import {
  Actions,
  ControlElement,
  HorizontalLayout,
  jsonformsReducer,
  JsonFormsState,
  NOT_APPLICABLE
} from '@jsonforms/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { combineReducers, createStore, Store } from 'redux';
import { materialFields, materialRenderers } from '../../src';
import MaterialObjectRenderer,
       { materialObjectControlTester } from '../../src/complex/MaterialObjectRenderer';
import HorizontalLayoutRenderer from '../../src/layouts/MaterialHorizontalLayout';

const initJsonFormsStore = (testData, testSchema, testUiSchema): Store<JsonFormsState> => {
  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    {
      jsonforms: {
        renderers: materialRenderers,
        fields: materialFields,
      }
    }
  );

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
    },
  },
};
const uischema1 = {
  type: 'Control',
  scope: '#',
};
const uischema2 = {
  type: 'Control',
  scope: '#/properties/foo',
};

describe('Material object renderer tester', () => {

  test('should fail', () => {
    expect(materialObjectControlTester(undefined, undefined)).toBe(NOT_APPLICABLE);
    expect(materialObjectControlTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialObjectControlTester({ type: 'Foo' }, undefined)).toBe(NOT_APPLICABLE);
    expect(materialObjectControlTester({ type: 'Control' }, undefined)).toBe(NOT_APPLICABLE);
    expect(
      materialObjectControlTester(
        uischema2,
        {
          type: 'object',
          properties: {
            foo: { type: 'string' },
          },
        },
      )
    ).toBe(NOT_APPLICABLE);
    expect(
      materialObjectControlTester(
        uischema2,
        {
          type: 'object',
          properties: {
            foo: { type: 'string' },
            bar: schema.properties.bar,
          },
        },
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed', () => {
    expect(
      materialObjectControlTester(
        uischema2,
        {
          type: 'object',
          properties: {
            foo: schema.properties.foo,
          },
        },
      )
    ).toBe(2);
  });
});

describe('Material object control', () => {

  /** Use this container to render components */
  const container = document.createElement('div');

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
  });

  it('should render all children', () => {
    const store = initJsonFormsStore(data, schema, uischema1);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialObjectRenderer schema={schema} uischema={uischema1} />
      </Provider>,
      container
    );

    const input = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input') as HTMLInputElement[];
    expect(input.length).toBe(2);
    expect(input[0].type).toBe('text');
    expect(input[0].value).toBe('foo');
    expect(input[1].type).toBe('text');
    expect(input[1].value).toBe('bar');
  });

  it('should render only itself', () => {
    const store = initJsonFormsStore(data, schema, uischema1);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialObjectRenderer schema={schema} uischema={uischema2} />
      </Provider>,
      container
    );

    const input = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input') as HTMLInputElement[];
    expect(input.length).toBe(1);
    expect(input[0].type).toBe('text');
    expect(input[0].value).toBe('foo');
  });

  it('should be enabled by default', () => {
    const store = initJsonFormsStore(data, schema, uischema2);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialObjectRenderer schema={schema} uischema={uischema2} />
      </Provider>,
      container
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.disabled).toBeFalsy();
  });

  it('can be invisible', () => {
    const store = initJsonFormsStore(data, schema, uischema2);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialObjectRenderer schema={schema} uischema={uischema2} visible={false} />
      </Provider>,
      container
    );
    const input = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input') as HTMLInputElement[];
    expect(input.length).toBe(0);
  });

  it('should be visible by default', () => {
    const store = initJsonFormsStore(data, schema, uischema2);
    const tree = ReactDOM.render(
      <Provider store={store}>
        <MaterialObjectRenderer schema={schema} uischema={uischema2} />
      </Provider>,
      container
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.hidden).toBeFalsy();
  });
});
