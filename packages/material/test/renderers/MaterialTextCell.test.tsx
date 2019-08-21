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
import TextCell, {
  materialTextCellTester
} from '../../src/cells/MaterialTextCell';
import { Provider } from 'react-redux';
import { materialRenderers } from '../../src';
import { combineReducers, createStore, Store } from 'redux';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JsonFormsReduxContext } from '@jsonforms/react';

Enzyme.configure({ adapter: new Adapter() });

const DEFAULT_MAX_LENGTH = 524288;
const DEFAULT_SIZE = 20;

const data = { name: 'Foo' };
const minLengthSchema = {
  type: 'string',
  minLength: 3
};
const maxLengthSchema = {
  type: 'string',
  maxLength: 5
};
const schema = { type: 'string' };

const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/name'
};

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
  const reducer = combineReducers({ jsonforms: jsonformsReducer() });
  const store: Store<JsonFormsState> = createStore(reducer, s);
  store.dispatch(Actions.init(testData, testSchema, testUiSchema));
  return store;
};

describe('Material text cell tester', () => {
  it('should fail', () => {
    expect(materialTextCellTester(undefined, undefined)).toBe(NOT_APPLICABLE);
    expect(materialTextCellTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialTextCellTester({ type: 'Foo' }, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialTextCellTester({ type: 'Control' }, undefined)).toBe(
      NOT_APPLICABLE
    );
  });
  it('should fail with wrong schema type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialTextCellTester(control, {
        type: 'object',
        properties: {
          foo: {
            type: 'number'
          }
        }
      })
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if only sibling has correct type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialTextCellTester(control, {
        type: 'object',
        properties: {
          foo: {
            type: 'number'
          },
          bar: {
            type: 'string'
          }
        }
      })
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed with matching prop type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialTextCellTester(control, {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          }
        }
      })
    ).toBe(1);
  });
});

describe('Material text cell', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { focus: true }
    };
    const store = initJsonFormsStore(data, minLengthSchema, control);
    wrapper = mount(
      <Provider store={store}>
        <TextCell schema={minLengthSchema} uischema={control} path='name' />
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeTruthy();
  });

  it('should not autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { focus: false }
    };
    const store = initJsonFormsStore(data, schema, control);
    wrapper = mount(
      <Provider store={store}>
        <TextCell schema={minLengthSchema} uischema={control} path={'name'} />
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should not autofocus by default', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const store = initJsonFormsStore(data, minLengthSchema, control);
    wrapper = mount(
      <Provider store={store}>
        <TextCell schema={minLengthSchema} uischema={control} path='name' />
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(document.activeElement).not.toBe(input);
  });

  it('should render', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' }
      }
    };
    const store = initJsonFormsStore(
      { name: 'Foo' },
      minLengthSchema,
      uischema
    );
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={jsonSchema} uischema={uischema} path={'name'} />
        </JsonFormsReduxContext>
      </Provider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('Foo');
  });

  it('should update via input event', () => {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={minLengthSchema} uischema={uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );

    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: 'Bar' } });
    expect(getData(store.getState()).name).toBe('Bar');
  });

  it('should update via action', () => {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={minLengthSchema} uischema={uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('name', () => 'Bar'));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('Bar');
  });

  it('should update with undefined value', () => {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={minLengthSchema} uischema={uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('name', () => undefined));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should update with null value', () => {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={minLengthSchema} uischema={uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('name', () => null));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should not update if wrong ref', () => {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={minLengthSchema} uischema={uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('firstname', () => 'Bar'));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('Foo');
  });

  it('should not update if null ref', () => {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={minLengthSchema} uischema={uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update(null, () => 'Bar'));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('Foo');
  });

  it('should not update if undefined ref', () => {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={minLengthSchema} uischema={uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update(undefined, () => 'Bar'));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('Foo');
  });

  it('can be disabled', () => {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell
            schema={minLengthSchema}
            uischema={uischema}
            path='name'
            enabled={false}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={minLengthSchema} uischema={uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeFalsy();
  });

  it('should use maxLength for size and maxlength attributes', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        trim: true,
        restrict: true
      }
    };
    const store = initJsonFormsStore(data, maxLengthSchema, control);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={maxLengthSchema} uischema={control} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().maxLength).toBe(5);
    expect(input.parent().props().width).not.toBe('100%');
    expect(input.props().size).toBe(5);
  });

  it('should use maxLength for size attribute', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { trim: true }
    };
    const store = initJsonFormsStore(data, maxLengthSchema, control);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={maxLengthSchema} uischema={control} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper
      .find('input')
      .first()
      .getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).not.toBe('100%');
    expect(input.size).toBe(5);
  });

  it('should use maxLength for maxlength attribute', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { restrict: true }
    };
    const store = initJsonFormsStore(data, maxLengthSchema, control);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={maxLengthSchema} uischema={control} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper
      .find('input')
      .first()
      .getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(5);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should not use maxLength by default', () => {
    const store = initJsonFormsStore(data, maxLengthSchema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={schema} uischema={uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper
      .find('input')
      .first()
      .getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should have default values for trim and restrict', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        trim: true,
        restrict: true
      }
    };
    const store = initJsonFormsStore(data, schema, control);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={schema} uischema={control} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper
      .find('input')
      .first()
      .getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should have a default value for trim', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { trim: true }
    };
    const store = initJsonFormsStore(data, schema, control);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={schema} uischema={control} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );

    const input = wrapper
      .find('input')
      .first()
      .getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should have default values for restrict', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { restrict: true }
    };
    const store = initJsonFormsStore(data, schema, control);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={schema} uischema={control} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );

    const input = wrapper
      .find('input')
      .first()
      .getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should have default values for attributes', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <TextCell schema={schema} uischema={uischema} path='name' />
      </Provider>
    );
    const input = wrapper
      .find('input')
      .first()
      .getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should be disabled', () => {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell
            schema={schema}
            uischema={uischema}
            path={'name'}
            enabled={false}
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBe(true);
  });
});
