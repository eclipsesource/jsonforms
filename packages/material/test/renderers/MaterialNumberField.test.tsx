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
import NumberField, { materialNumberFieldTester } from '../../src/fields/MaterialNumberField';
import HorizontalLayoutRenderer from '../../src/layouts/MaterialHorizontalLayout';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';
import { materialFields, materialRenderers } from '../../src';
import { combineReducers, createStore, Store } from 'redux';

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

const data = {'foo': 3.14};
const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'number',
      minimum: 5
    },
  },
};
const uischema = {
  type: 'Control',
  scope: '#/properties/foo'
};

describe('Materila number field tester', () => {

  it('should fail', () => {
    expect(materialNumberFieldTester(undefined, undefined)).toBe(NOT_APPLICABLE);
    expect(materialNumberFieldTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialNumberFieldTester({type: 'Foo'}, undefined)).toBe(NOT_APPLICABLE);
    expect(materialNumberFieldTester({type: 'Control'}, undefined)).toBe(NOT_APPLICABLE);
  });

  it('should succeed with wrong schema type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialNumberFieldTester(
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
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if only sibling has correct type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialNumberFieldTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'string'
            },
            bar: {
              type: 'number'
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
      materialNumberFieldTester(
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
    ).toBe(2);
  });

});

describe('Material number field', () => {

  it('should autofocus first element', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        firstNumberField: {type: 'number', minimum: 5},
        secondNumberField: {type: 'number', minimum: 5}
      }
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/firstNumberField',
      options: {
        focus: true
      }
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/secondNumberField',
      options: {
        focus: true
      }
    };
    const layout: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [
        firstControlElement,
        secondControlElement
      ]
    };
    const store = initJsonFormsStore(
      {
        'firstNumberField': 3.14,
        'secondNumberField': 5.12
      },
      schema,
      uischema
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

  it('should autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: true
      }
    };
    const store = initJsonFormsStore(data, schema, control);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <NumberField schema={schema} uischema={control}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(document.activeElement).toBe(input);
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
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <NumberField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.autofocus).toBeFalsy();
  });

  it('should not autofocus by default', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    const store = initJsonFormsStore(data, schema, control);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <NumberField schema={schema} uischema={control}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.autofocus).toBeFalsy();
  });

  it('should render', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        foo: {
          type: 'number'
        }
      }
    };
    const store = initJsonFormsStore(
      {'foo': 3.14},
      schema,
      uischema
    );
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <NumberField schema={jsonSchema} uischema={uischema}/>
      </Provider>
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.type).toBe('number');
    expect(input.step).toBe('0.1');
    expect(input.value).toBe('3.14');
  });

  it('should update via input event', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <NumberField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    input.value = '2.72';
    TestUtils.Simulate.change(input);
    expect(getData(store.getState()).foo).toBe(2.72);
  });

  it('should update via action', () => {
    const store = initJsonFormsStore(
      { 'foo': 2.72 },
      schema,
      uischema
    );
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <NumberField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.value).toBe('2.72');
    store.dispatch(update('foo', () => 3.14));
    expect(input.value).toBe('3.14');
  });

  it('should update with undefined value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <NumberField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(update('foo', () => undefined));
    expect(input.value).toBe('');
  });

  it('should not update with null value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <NumberField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(update('foo', () => null));
    expect(input.value).toBe('');
  });

  it('should not update with wrong ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <NumberField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(update('bar', () => 11));
    expect(input.value).toBe('3.14');
  });

  it('should not update with null ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <NumberField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(update(null, () => 2.72));
    expect(input.value).toBe('3.14');
  });

  it('should not update with undefined ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <NumberField schema={schema} uischema={uischema}/>
      </Provider>
    );
    store.dispatch(update(undefined, () => 13));
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.value).toBe('3.14');
  });

  it('can be disabled', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <NumberField schema={schema} uischema={uischema} enabled={false}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <NumberField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.disabled).toBeFalsy();
  });
});
