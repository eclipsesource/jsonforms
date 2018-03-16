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
import SliderField, { materialSliderFieldTester } from '../../src/fields/MaterialSliderField';
import HorizontalLayoutRenderer from '../../src/layouts/MaterialHorizontalLayout';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';
import { materialFields, materialRenderers } from '../../src';
import { combineReducers, createStore, Store } from 'redux';

const data = {'foo': 5};
const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'number',
      maximum: 10,
      minimum: 2,
      default: 6
    },
  },
};
const uischema = {
  type: 'Control',
  scope: '#/properties/foo',
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

describe('Material slider tester', () => {

  it('should fail', () => {
    expect(materialSliderFieldTester(undefined, undefined)).toBe(NOT_APPLICABLE);
    expect(materialSliderFieldTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialSliderFieldTester({type: 'Foo'}, undefined)).toBe(NOT_APPLICABLE);
    expect(materialSliderFieldTester({type: 'Control'}, undefined)).toBe(NOT_APPLICABLE);
  });

  it('should fail with wrong schema type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialSliderFieldTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {type: 'string'}
          }
        }
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if only sibling has correct prop type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialSliderFieldTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {type: 'string'},
            bar: {type: 'number'}
          }
        }
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if maximum and minimum are missing', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialSliderFieldTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {type: 'number'}
          }
        }
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if maximum is missing', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialSliderFieldTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
              minimum: 2
            }
          }
        }
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if minimum is missing', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialSliderFieldTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
              maximum: 10
            }
          }
        }
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail is default is missing', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialSliderFieldTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
              maximum: 10,
              minimum: 2
            }
          }
        }
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed with number type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialSliderFieldTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
              maximum: 10,
              minimum: 2,
              default: 6
            }
          }
        }
      )
    ).toBe(4);
  });

  it('should succeed with integer type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialSliderFieldTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'integer',
              maximum: 10,
              minimum: 2,
              default: 6
            }
          }
        }
      )
    ).toBe(4);
  });

});

describe('Material slider field', () => {
  it('should autofocus first element', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        firstSliderField: {type: 'number', minimum: 5, maximum: 10},
        secondSliderField: {type: 'number', minimum: 5, maximum: 10}
      }
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/firstSliderField',
      options: {focus: true}
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/secondSliderField',
      options: {focus: true}
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
        firstSliderField: 3.14,
        secondSliderField: 5.12
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
      options: {focus: true}
    };
    const store = initJsonFormsStore(data, schema, control);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <SliderField schema={schema} uischema={control}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(document.activeElement).toBe(input);
  });

  it('should not autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {focus: false}
    };
    const store = initJsonFormsStore(data, schema, control);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <SliderField schema={schema} uischema={control}/>
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
        <SliderField schema={schema} uischema={uischema}/>
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
          type: 'number',
          maximum: 10,
          minimum: 2,
          default: 6
        }
      }
    };
    const store = initJsonFormsStore({ foo: 5 }, jsonSchema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <SliderField schema={jsonSchema} uischema={uischema}/>
      </Provider>
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.type).toBe('range');
    expect(input.value).toBe('5');
  });

  it('should update via input event', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <SliderField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    input.value = '3';
    TestUtils.Simulate.change(input);
    expect(getData(store.getState()).foo).toBe(3);
  });

  it('should update via action', () => {
    const store = initJsonFormsStore({ foo: 3 }, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <SliderField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.value).toBe('3');
    store.dispatch(update('foo', () => 4));
    expect(input.value).toBe('4');
  });

  it('should not update with undefined value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <SliderField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(update('foo', () => undefined));
    expect(input.value).toBe(schema.properties.foo.default.toString());
  });

  it('should not update with null value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <SliderField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(update('foo', () => null));
    expect(input.value).toBe(schema.properties.foo.default.toString());
  });

  it('should not update with wrong ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <SliderField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(update('bar', () => 11));
    expect(input.value).toBe('5');
  });

  it('should not update with null ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <SliderField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(update(null, () => 3));
    expect(input.value).toBe('5');
  });

  it('should not update with undefined ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <SliderField schema={schema} uischema={uischema}/>
      </Provider>
    );
    store.dispatch(update(undefined, () => 13));
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.value).toBe('5');
  });

  it('can be disabled', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <SliderField schema={schema} uischema={uischema} enabled={false}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <SliderField schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.disabled).toBeFalsy();
  });
});
