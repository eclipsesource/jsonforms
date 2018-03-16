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
import * as React from 'react';
import {
  Actions,
  ControlElement,
  getData,
  HorizontalLayout,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  NOT_APPLICABLE,
  update
} from '@jsonforms/core';
import TextField, { materialTextFieldTester, } from '../../src/fields/MaterialTextField';
import HorizontalLayoutRenderer from '../../src/layouts/MaterialHorizontalLayout';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';
import { materialFields, materialRenderers } from '../../src';
import { combineReducers, createStore, Store } from 'redux';

const DEFAULT_MAX_LENGTH = 524288;
const DEFAULT_SIZE = 20;

const data =  { 'name': 'Foo' };
const minLengthSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3
    }
  }
};
const maxLengthSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      maxLength: 5
    }
  }
};
const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' }
  }
};
const uischema = {
  type: 'Control',
  scope: '#/properties/name'
};

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

describe('Material text field tester', () => {
  it('should fail', () =>  {
    expect(materialTextFieldTester(undefined, undefined)).toBe(NOT_APPLICABLE);
    expect(materialTextFieldTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialTextFieldTester({type: 'Foo'}, undefined)).toBe(NOT_APPLICABLE);
    expect(materialTextFieldTester({type: 'Control'}, undefined)).toBe(NOT_APPLICABLE);
  });
  it('should fail with wrong schema type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialTextFieldTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number'
            }
          }
        }
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if only sibling has correct type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialTextFieldTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number'
            },
            bar: {
              type: 'string'
            }
          }
        }
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed with matching prop type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialTextFieldTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'string'
            }
          }
        }
      )
    ).toBe(1);
  });
});

describe('Material text field', () => {
  it('should autofocus first element', () =>  {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' }
      }
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/firstName',
      options: { focus: true }
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/lastName',
      options: {
        focus: true
      }
    };
    const layout: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [firstControlElement, secondControlElement]
    };
    const store = initJsonFormsStore(
      { firstName: 'Foo', lastName: 'Boo' },
      jsonSchema,
      layout
    );
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <HorizontalLayoutRenderer schema={jsonSchema} uischema={layout}/>
      </Provider>
    );
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
    expect(document.activeElement).not.toBe(inputs[0]);
    expect(document.activeElement).toBe(inputs[1]);
  });

  it('should autofocus via option', () =>  {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { focus: true }
    };
    const store = initJsonFormsStore(data, minLengthSchema, control);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={minLengthSchema} uischema={control}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(document.activeElement).toBe(input);
  });

  it('should not autofocus via option', () =>  {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { focus: false }
    };
    const store = initJsonFormsStore(data, schema, control);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={minLengthSchema} uischema={control}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(document.activeElement).not.toBe(input);
  });

  it('should not autofocus by default', () =>  {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const store = initJsonFormsStore(data, minLengthSchema, control);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={minLengthSchema} uischema={control}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(document.activeElement).not.toBe(input);
  });

  it('should render', () =>  {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' }
      }
    };
    const store = initJsonFormsStore({ 'name': 'Foo' }, minLengthSchema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={jsonSchema} uischema={uischema}/>
      </Provider>
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.value).toBe('Foo');
  });

  it('should update via input event', () =>  {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={minLengthSchema} uischema={uischema}/>
      </Provider>
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    input.value = 'Bar';
    TestUtils.Simulate.change(input);
    expect(getData(store.getState()).name).toBe('Bar');
  });

  it('should update via action', () =>  {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={minLengthSchema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(update('name', () => 'Bar'));
    expect(input.value).toBe('Bar');
  });

  it('should update with undefined value', () =>  {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={minLengthSchema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(update('name', () => undefined));
    expect(input.value).toBe('');
  });

  it('should update with null value', () =>  {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={minLengthSchema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(update('name', () => null));
    expect(input.value).toBe('');
  });

  it('should not update if wrong ref', () =>  {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={minLengthSchema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(update('firstname', () => 'Bar'));
    expect(input.value).toBe('Foo');
  });

  it('should not update if null ref', () =>  {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={minLengthSchema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(update(null, () => 'Bar'));
    expect(input.value).toBe('Foo');
  });

  it('should not update if undefined ref', () =>  {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={minLengthSchema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(update(undefined, () => 'Bar'));
    expect(input.value).toBe('Foo');
  });

  it('can be disabled', () =>  {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={minLengthSchema} uischema={uischema} enabled={false}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.disabled).toBeTruthy();
  });

  it('should be enabled by default', () =>  {
    const store = initJsonFormsStore(data, minLengthSchema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={minLengthSchema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.disabled).toBeFalsy();
  });

  it('should use maxLength for size and maxlength attributes', () =>  {
    const control = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        trim: true,
        restrict: true
      }
    };
    const store = initJsonFormsStore(data, maxLengthSchema, control);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={maxLengthSchema} uischema={control}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.maxLength).toBe(5);
    expect(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'))
      .not.toBe('100%');
    expect(input.size).toBe(5);
  });

  it('should use maxLength for size attribute', () =>  {
    const control = {
      type: 'Control',
      scope: '#/properties/name',
      options: { trim: true }
    };
    const store = initJsonFormsStore(data, maxLengthSchema, control);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={maxLengthSchema} uischema={control}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      window.getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).not.toBe('100%');
    expect(input.size).toBe(5);
  });

  it('should use maxLength for maxlength attribute', () =>  {
    const control = {
      type: 'Control',
      scope: '#/properties/name',
      options: { restrict: true }
    };
    const store = initJsonFormsStore(data, maxLengthSchema, control);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={maxLengthSchema} uischema={control}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.maxLength).toBe(5);
    expect(
      window.getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should not use maxLength by default', () =>  {
    const store = initJsonFormsStore(data, maxLengthSchema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      window.getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should have default values for trim and restrict', () =>  {
    const control = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        trim: true,
        restrict: true
      }
    };
    const store = initJsonFormsStore(data, schema, control);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={schema} uischema={control}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      window.getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should have a default value for trim', () =>  {
    const control = {
      type: 'Control',
      scope: '#/properties/name',
      options: { trim: true }
    };
    const store = initJsonFormsStore(data, schema, control);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={schema} uischema={control}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      window.getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should have default values for restrict', () =>  {
    const control = {
      type: 'Control',
      scope: '#/properties/name',
      options: { restrict: true }
    };
    const store = initJsonFormsStore(data, schema, control);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={schema} uischema={control}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      window.getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should have default values for attributes', () =>  {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TextField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      window.getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });
});
