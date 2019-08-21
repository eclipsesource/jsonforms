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
  UISchemaElement,
  update
} from '@jsonforms/core';
import { JsonFormsReduxContext } from '@jsonforms/react';
import MaterialDateCell, {
  materialDateCellTester
} from '../../src/cells/MaterialDateCell';
import { Provider } from 'react-redux';
import { materialRenderers } from '../../src';
import { AnyAction, combineReducers, createStore, Reducer, Store } from 'redux';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

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

const data = { foo: '1980-06-04' };
const schema = {
  type: 'string',
  format: 'date'
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};

describe('Material date cell', () => {
  it('should fail', () => {
    expect(materialDateCellTester(undefined, undefined)).toBe(NOT_APPLICABLE);
    expect(materialDateCellTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialDateCellTester({ type: 'Foo' }, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialDateCellTester({ type: 'Control' }, undefined)).toBe(
      NOT_APPLICABLE
    );

    expect(
      materialDateCellTester(uischema, {
        type: 'object',
        properties: {
          foo: { type: 'string' }
        }
      })
    ).toBe(NOT_APPLICABLE);
    expect(
      materialDateCellTester(uischema, {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          bar: {
            type: 'string',
            format: 'date'
          }
        }
      })
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed', () => {
    expect(
      materialDateCellTester(uischema, {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            format: 'date'
          }
        }
      })
    ).toBe(2);
  });
});

describe('Material date cell', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

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
          <MaterialDateCell schema={schema} uischema={control} path='foo' />
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
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateCell schema={schema} uischema={control} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should not autofocus by default', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateCell schema={schema} uischema={control} path='foo' />
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
          <MaterialDateCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().type).toBe('date');
    expect(input.props().value).toBe('1980-06-04');
  });

  it('should update via event', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: '1961-04-12' } });
    expect(getData(store.getState()).foo).toBe('1961-04-12');
  });

  it('should update via action', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('foo', () => '1961-04-12'));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('1961-04-12');
  });

  it('should update with null value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('foo', () => null));
    wrapper.update();
    const input = wrapper.find('input');
    expect(input.props().value).toBe('');
  });

  it('should update with undefined value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('foo', () => undefined));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should not update with wrong ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    store.dispatch(update('bar', () => 'Bar'));
    expect(input.props().value).toBe('1980-06-04');
  });

  it('should not update with null ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update(null, () => '1961-04-12'));
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('1980-06-04');
  });

  it('should update with undefined ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    store.dispatch(update(undefined, () => '1961-04-12'));
    expect(input.props().value).toBe('1980-06-04');
  });

  it('can be disabled', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateCell
            schema={schema}
            uischema={uischema}
            enabled={false}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateCell schema={schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeFalsy();
  });
});
