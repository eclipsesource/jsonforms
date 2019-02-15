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
  ControlElement, getData,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  NOT_APPLICABLE,
  UISchemaElement
} from '@jsonforms/core';
import IntegerField, { materialIntegerFieldTester } from '../../src/fields/MaterialIntegerField';
import { Provider } from 'react-redux';
import { materialFields, materialRenderers } from '../../src';
import { combineReducers, createStore, Store } from 'redux';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const data = {'foo': 42};
const schema = {
  type: 'integer',
  minimum: 5
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
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

describe('Material integer field tester', () => {

  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };

  it('should fail', () => {
    expect(materialIntegerFieldTester(undefined, undefined)).toBe(NOT_APPLICABLE);
    expect(materialIntegerFieldTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialIntegerFieldTester({type: 'Foo'}, undefined)).toBe(NOT_APPLICABLE);
    expect(materialIntegerFieldTester({type: 'Control'}, undefined)).toBe(NOT_APPLICABLE);
    expect(
      materialIntegerFieldTester(
        controlElement,
        {type: 'object', properties: {foo: {type: 'string'}}}
      )
    ).toBe(NOT_APPLICABLE);
    expect(
      materialIntegerFieldTester(
        controlElement,
        {type: 'object', properties: {foo: {type: 'string'}, bar: {type: 'integer'}}}
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed', () => {
    expect(
      materialIntegerFieldTester(
        controlElement,
        { type: 'object', properties: { foo: { type: 'integer' } } }
      )
    ).toBe(2);
  });
});

describe('Material integer field', () => {

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
        <IntegerField
          schema={schema}
          uischema={control}
          path='foo'
        />
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
        <IntegerField
          schema={schema}
          uischema={control}
          path='foo'
        />
      </Provider>
    );
    const input = wrapper.find('input');
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should not autofocus by default', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    const store = initJsonFormsStore(data, schema, control);
    wrapper = mount(
      <Provider store={store}>
        <IntegerField
          schema={schema}
          uischema={control}
          path='foo'
        />
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should render', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <IntegerField
          schema={schema}
          uischema={uischema}
          path='foo'
        />
      </Provider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().type).toBe('number');
    expect(input.props().step).toBe('1');
    expect(input.props().value).toBe(42);
  });

  it('should update via input event', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <IntegerField
          schema={schema}
          uischema={uischema}
          path='foo'
        />
      </Provider>
    );

    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 13 } });
    expect(getData(store.getState()).foo).toBe(13);
  });

  it('should update via action', () => {
    const store = initJsonFormsStore(
      { 'foo': 13 },
      schema,
      uischema
    );
    wrapper = mount(
      <Provider store={store}>
        <IntegerField
          schema={schema}
          uischema={uischema}
          path='foo'
        />
      </Provider>
    );
    store.dispatch(Actions.update('foo', () => 42));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe(42);
  });

  it('should not update with undefined value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <IntegerField
          schema={schema}
          uischema={uischema}
          path='foo'
        />
      </Provider>
    );
    store.dispatch(Actions.update('foo', () => undefined));
    wrapper.update();
    const input = wrapper.find('input');
    expect(input.props().value).toBe('');
  });

  it('should not update with null value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <IntegerField
          schema={schema}
          uischema={uischema}
          path='foo'
        />
      </Provider>
    );
    store.dispatch(Actions.update('foo', () => null));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should not update with wrong ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <IntegerField
          schema={schema}
          uischema={uischema}
          path='foo'
        />
      </Provider>
    );
    store.dispatch(Actions.update('bar', () => 11));
    wrapper.update();
    const input = wrapper.find('input');
    expect(input.props().value).toBe(42);
  });

  it('should not update with null ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <IntegerField
          schema={schema}
          uischema={uischema}
          path='foo'
        />
      </Provider>
    );
    store.dispatch(Actions.update(null, () => 13));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe(42);
  });

  it('should not update with undefined ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <IntegerField
          schema={schema}
          uischema={uischema}
          path='foo'
        />
      </Provider>
    );
    store.dispatch(Actions.update(undefined, () => 13));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe(42);
  });

  it('can be disabled', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <IntegerField
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
        <IntegerField
          schema={schema}
          uischema={uischema}
          path='foo'
        />
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeFalsy();
  });
});
