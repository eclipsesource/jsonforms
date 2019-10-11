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
import './MatchMediaMock';
import React, { Reducer } from 'react';
import Enzyme, { mount } from 'enzyme';
import { materialRenderers } from '../../src';
import { Actions, jsonformsReducer, JsonFormsState, RuleEffect } from '@jsonforms/core';
import MaterialVerticalLayout from '../../src/layouts/MaterialVerticalLayout';
import Adapter from 'enzyme-adapter-react-16';
import { AnyAction, combineReducers, createStore, Store } from 'redux';
import { JsonFormsReduxContext } from '@jsonforms/react';
import { Provider } from 'react-redux';

Enzyme.configure({ adapter: new Adapter() });

const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'boolean'
    },
    bar: {
      type: 'string'
    },
    foz: {
      type: 'boolean'
    },
    baz: {
      type: 'number'
    }
  }
};
const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/foo'
    },
    {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/bar'
        },
        {
          type: 'Control',
          scope: '#/properties/foz'
        },
        {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/baz'
            }
          ],
          rule: {
            effect: RuleEffect.ENABLE,
            condition: {
              scope: '#/properties/foz',
              schema: { const: true }
            }
          }
        }
      ],
      rule: {
        effect: RuleEffect.ENABLE,
        condition: {
          scope: '#/properties/foo',
          schema: { const: true }
        }
      }
    }
  ]
};

const uischema2 = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/foo'
    },
    {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/bar'
        },
        {
          type: 'Control',
          scope: '#/properties/foz'
        },
        {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/baz'
            }
          ],
          rule: {
            effect: RuleEffect.SHOW,
            condition: {
              scope: '#/properties/foz',
              schema: { const: true }
            }
          }
        }
      ],
      rule: {
        effect: RuleEffect.SHOW,
        condition: {
          scope: '#/properties/foo',
          schema: { const: true }
        }
      }
    }
  ]
};

const initStore = () => {
  const s: JsonFormsState = {
    jsonforms: {
      renderers: materialRenderers
    }
  };
  const reducer: Reducer<JsonFormsState, AnyAction> = combineReducers({
    jsonforms: jsonformsReducer()
  });
  const store: Store<JsonFormsState> = createStore(reducer, s);

  return store;
};

describe('Material vertical layout', () => {
  it('should have a disabled input field', () => {
    const store = initStore();
    const data = { foo: false, foz: true };
    store.dispatch(Actions.init(data, schema, uischema));
    const wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialVerticalLayout schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    expect(wrapper.find('input[type="text"]').first().props().disabled).toBe(true);
    expect(wrapper.find('input[type="number"]').first().props().disabled).toBe(false);
  });

  it('should have an enabled input field', () => {
    const store = initStore();
    const data = { foo: true, foz: false };
    store.dispatch(Actions.init(data, schema, uischema));
    const wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialVerticalLayout schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    expect(wrapper.find('input[type="text"]').first().props().disabled).toBe(false);
    expect(wrapper.find('input[type="number"]').first().props().disabled).toBe(true);
  });

  it('should have an visible input field', () => {
    const store = initStore();
    const data = { foo: true, foz: false };
    store.dispatch(Actions.init(data, schema, uischema2));
    const wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialVerticalLayout schema={schema} uischema={uischema2} />
        </JsonFormsReduxContext>
      </Provider>
    );
    expect(wrapper.find('input[type="text"]')).toHaveLength(1);
    expect(wrapper.find('input[type="number"]')).toHaveLength(0);
  });

  it('should have an hidden input field', () => {
    const store = initStore();
    const data = { foo: false, foz: true };
    store.dispatch(Actions.init(data, schema, uischema2));
    const wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialVerticalLayout schema={schema} uischema={uischema2} />
        </JsonFormsReduxContext>
      </Provider>
    );
    expect(wrapper.find('input[type="text"]')).toHaveLength(0);
    expect(wrapper.find('input[type="number"]')).toHaveLength(0);
  });
});
