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
  getData,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  NOT_APPLICABLE,
  UISchemaElement
} from '@jsonforms/core';
import BooleanCell, {
  materialBooleanCellTester
} from '../../src/cells/MaterialBooleanCell';
import { Provider } from 'react-redux';
import * as ReactDOM from 'react-dom';
import { combineReducers, createStore, Store } from 'redux';
import { materialRenderers } from '../../src';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JsonFormsReduxContext } from '@jsonforms/react';

Enzyme.configure({ adapter: new Adapter() });

export const initJsonFormsStore = (
  testData: any,
  testSchema: JsonSchema,
  testUiSchema: UISchemaElement
): Store<JsonFormsState> => {
  const s: JsonFormsState = {
    jsonforms: {
      renderers: materialRenderers
    }
  };
  const reducer = combineReducers({ jsonforms: jsonformsReducer() });
  const store: Store<JsonFormsState> = createStore(reducer, s);
  store.dispatch(Actions.init(testData, testSchema, testUiSchema));
  return store;
};

const data = { foo: true };
const schema = {
  type: 'boolean'
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};

describe('Material boolean cell tester', () => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };

  it('should fail', () => {
    expect(materialBooleanCellTester(undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialBooleanCellTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialBooleanCellTester({ type: 'Foo' }, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialBooleanCellTester({ type: 'Control' }, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(
      materialBooleanCellTester(control, {
        type: 'object',
        properties: { foo: { type: 'string' } }
      })
    ).toBe(NOT_APPLICABLE);
    expect(
      materialBooleanCellTester(control, {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          },
          bar: {
            type: 'boolean'
          }
        }
      })
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed', () => {
    expect(
      materialBooleanCellTester(control, {
        type: 'object',
        properties: {
          foo: {
            type: 'boolean'
          }
        }
      })
    ).toBe(2);
  });
});

describe('Material boolean cell', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  /** Use this container to render components */
  const container = document.createElement('div');

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
  });

  // seems to be broken in material-ui
  it('should autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: true
      }
    };
    const store = initJsonFormsStore(data, schema, control);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={schema} uischema={control} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeTruthy();
  });

  it('should not autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: false
      }
    };
    const store = initJsonFormsStore(data, schema, control);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={schema} uischema={control} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBe(false);
  });

  it('should not autofocus by default', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    const store = initJsonFormsStore(data, schema, control);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should render', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().type).toBe('checkbox');
    expect(input.props().checked).toBeTruthy();
  });

  it('should update via input event', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );

    const input = wrapper.find('input');
    input.simulate('change', { target: { value: false } });
    expect(getData(store.getState()).foo).toBeFalsy();
  });

  it('should update via action', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(Actions.update('foo', () => false));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().checked).toBeFalsy();
    expect(getData(store.getState()).foo).toBeFalsy();
  });

  it('should update with undefined value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(Actions.update('foo', () => undefined));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().checked).toBeFalsy();
  });

  it('should update with null value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(Actions.update('foo', () => null));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().checked).toBeFalsy();
  });

  it('should not update with wrong ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    store.dispatch(Actions.update('bar', () => 11));
    expect(input.props().checked).toBeTruthy();
  });

  it('should not update with null ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    store.dispatch(Actions.update(null, () => false));
    expect(input.props().checked).toBeTruthy();
  });

  it('should not update with an undefined ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(Actions.update(undefined, () => false));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().checked).toBeTruthy();
  });

  it('can be disabled', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <BooleanCell
          schema={schema}
          uischema={uischema}
          enabled={false}
          path='foo'
        />
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <BooleanCell schema={schema} uischema={uischema} path='foo' />
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeFalsy();
  });

  it('id should be present in output', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <BooleanCell schema={schema} uischema={uischema} path='foo' id='myid' />
      </Provider>
    );
    const input = wrapper.find('input');
    expect(input.props().id).toBe('myid');
  });
});
