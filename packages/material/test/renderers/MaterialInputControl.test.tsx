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
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';
import {
  Actions,
  ControlElement,
  HorizontalLayout,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  NOT_APPLICABLE
} from '@jsonforms/core';
import '../../src/fields';
import MaterialInputControl, {
  materialInputControlTester
} from '../../src/controls/MaterialInputControl';
import MaterialHorizontalLayoutRenderer from '../../src/layouts/MaterialHorizontalLayout';
import { materialFields, materialRenderers } from '../../src';
import { combineReducers, createStore, Store } from 'redux';

const data = { 'foo': 'bar' };
const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string'
    }
  }
};
const uischema = {
  type: 'Control',
  scope: '#/properties/foo'
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

describe('Material input control tester', () => {
  it('should fail', () => {
    expect(materialInputControlTester(undefined, undefined)).toBe(NOT_APPLICABLE);
    expect(materialInputControlTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialInputControlTester({type: 'Foo'}, undefined)).toBe(NOT_APPLICABLE);
    expect(materialInputControlTester({type: 'Control'}, undefined)).toBe(NOT_APPLICABLE);
  });
  it('should succeed', () => {
    const control: ControlElement = {type: 'Control', scope: '#/properties/foo'};
    expect(materialInputControlTester(control, undefined)).toBe(1);
  });
});

describe('Material input control', () => {

  it('should autofocus the first element', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        firstStringField: {type: 'string'},
        secondStringField: {type: 'string'}
      }
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/firstStringField',
      options: {
        focus: true
      }
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/secondStringField',
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
        'firstStringField': true,
        'secondStringField': false
      },
      schema,
      uischema
    );
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialHorizontalLayoutRenderer schema={jsonSchema} uischema={layout}/>
      </Provider>
    );
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
    expect(document.activeElement).not.toBe(inputs[0]);
    expect(document.activeElement).toBe(inputs[1]);
  });

  it('render', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialInputControl schema={schema} uischema={uischema}/>
      </Provider>
    );

    const control = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'div')[0];
    expect(control).toBeDefined();
    expect(control.childNodes.length).toBe(3);

    const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
    expect(label.textContent).toBe('Foo');

    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input).toBeDefined();
    expect(input).not.toBeNull();

    const validation = TestUtils.findRenderedDOMComponentWithTag(tree, 'p');
    expect(validation.tagName).toBe('P');
    expect(validation.className.indexOf('MuiFormHelperText-root')).not.toBe(-1);
    expect((validation as HTMLParagraphElement).children.length).toBe(0);
  });

  it('should render without label', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      label: false
    };
    const store = initJsonFormsStore(data, schema, control);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialInputControl schema={schema} uischema={control}/>
      </Provider>
    );

    const div = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'div')[0];
    expect(div).toBeDefined();
    expect(div.childNodes.length).toBe(3);

    const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
    expect(label.textContent).toBe('');

    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input).toBeDefined();
    expect(input).not.toBeNull();

    const validation = TestUtils.findRenderedDOMComponentWithTag(tree, 'p');
    expect(validation.tagName).toBe('P');
    expect(validation.className.indexOf('MuiFormHelperText-root')).not.toBe(-1);
    expect((validation as HTMLParagraphElement).children.length).toBe(0);
  });

  it('can be hidden', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialInputControl
          schema={schema}
          uischema={uischema}
          visible={false}
        />
      </Provider>
    );
    const control = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'div')[0] as HTMLElement;
    expect(getComputedStyle(control).display).toBe('none');
  });

  it('should be shown by default', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialInputControl schema={schema} uischema={uischema}/>
      </Provider>
    );
    const control = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'div')[0] as HTMLElement;
    expect(control.hidden).toBeFalsy();
  });

  it('should display a single error', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialInputControl schema={schema} uischema={uischema}/>
      </Provider>
    );

    const validation = TestUtils.findRenderedDOMComponentWithTag(tree, 'p');
    store.dispatch(Actions.update('foo', () => 2));
    expect(validation.textContent).toBe('should be string');
  });

  it('should display multiple errors', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialInputControl schema={schema} uischema={uischema}/>
      </Provider>
    );
    const validation = TestUtils.findRenderedDOMComponentWithTag(tree, 'p');
    store.dispatch(Actions.update('foo', () => 3));
    expect(validation.textContent).toBe('should be string');
  });

  it('should not show any errors', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialInputControl schema={schema} uischema={uischema}/>
      </Provider>
    );
    const validation = TestUtils.findRenderedDOMComponentWithTag(tree, 'p');
    expect(validation.textContent).toBe('');
  });

  it('should handle validation updates', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialInputControl schema={schema} uischema={uischema}/>
      </Provider>
    );
    const validation = TestUtils.findRenderedDOMComponentWithTag(tree, 'p');
    store.dispatch(Actions.update('foo', () => 3));
    store.dispatch(Actions.update('foo', () => 'bar'));
    expect(validation.textContent).toBe('');
  });

  it('should handle validation with nested schemas', () => {
    const jsonSchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        personalData: {
          type: 'object',
          properties: {
            middleName: {
              type: 'string'
            },
            lastName: {
              type: 'string'
            }
          },
          required: ['middleName', 'lastName']
        }
      },
      required: ['name']
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/personalData/properties/middleName'
    };
    const thirdControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/personalData/properties/lastName'
    };
    const layout: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [
        firstControlElement,
        secondControlElement,
        thirdControlElement
      ]
    };
    const store = initJsonFormsStore(
      {
        name: 'John Doe',
        personalData: {}
      },
      jsonSchema,
      layout
    );
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialHorizontalLayoutRenderer schema={jsonSchema} uischema={layout}/>
      </Provider>
    );
    const validation = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'p');
    expect(validation[0].textContent).toBe('');
    expect(validation[1].textContent).toBe('is a required property');
    expect(validation[2].textContent).toBe('is a required property');
  });

  it('should display a marker for a required prop', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        dateField: {
          type: 'string',
          format: 'date'
        }
      },
      required: ['dateField']
    };
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/dateField'
    };

    const store = initJsonFormsStore({}, jsonSchema, control);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialInputControl schema={jsonSchema} uischema={control}/>
      </Provider>
    );
    const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label');
    expect(label.textContent).toBe('Date Field*');
  });

  it('should not display a marker for a non-required prop', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        dateField: {
          type: 'string',
          format: 'date'
        }
      }
    };
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/dateField'
    };

    const store = initJsonFormsStore({}, jsonSchema, control);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialInputControl schema={jsonSchema} uischema={control}/>
      </Provider>
    );
    const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label');
    expect(label.textContent).toBe('Date Field');
  });
});
