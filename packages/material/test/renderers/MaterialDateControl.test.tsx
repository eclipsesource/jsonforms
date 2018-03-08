import { Provider } from 'react-redux';
import {
  Actions,
  ControlElement,
  getData,
  HorizontalLayout,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  NOT_APPLICABLE
} from '@jsonforms/core';
import HorizontalLayoutRenderer from '../../src/layouts/MaterialHorizontalLayout';
import MaterialDateControl, {
  materialDateControlTester
} from '../../src/controls/MaterialDateControl';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { combineReducers, createStore, Store } from 'redux';
import { materialFields, materialRenderers } from '../../src';

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

const data = { 'foo': '1980-06-04' };
const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      format: 'date'
    },
  },
};
const uischema = {
  type: 'Control',
  scope: '#/properties/foo',
};

describe('Material date control tester', () => {

  test('should fail', () => {
    expect(materialDateControlTester(undefined, undefined)).toBe(NOT_APPLICABLE);
    expect(materialDateControlTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialDateControlTester({type: 'Foo'}, undefined)).toBe(NOT_APPLICABLE);
    expect(materialDateControlTester({type: 'Control'}, undefined)).toBe(NOT_APPLICABLE);
    expect(
      materialDateControlTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {type: 'string'},
          },
        },
      )
    ).toBe(NOT_APPLICABLE);
    expect(
      materialDateControlTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {type: 'string'},
            bar: {
              type: 'string',
              format: 'date',
            },
          },
        },
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed', () => {
    expect(
      materialDateControlTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
              format: 'date',
            },
          },
        },
      )
    ).toBe(4);
  });
});

describe('Material date control', () => {

  test.skip('should autofocus first element', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        firstDate: { type: 'string', format: 'date' },
        secondDate: { type: 'string', format: 'date' }
      }
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/firstDate',
      options: {
        focus: true
      }
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/secondDate',
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
        firstDate: '1980-04-04',
        secondDate: '1980-04-04'
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
        <MaterialDateControl schema={schema} uischema={control}/>
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
        <MaterialDateControl schema={schema} uischema={control}/>
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
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={control}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.autofocus).toBeFalsy();
  });

  test('should render', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.type).toBe('text');
    expect(input.value).toBe('1980-06-04');
  });

  it('should update via event', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    input.value = '1961-04-12';
    TestUtils.Simulate.change(input);
    expect(getData(store.getState()).foo).toBe('1961-04-12');
  });

  it('should update via action', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(Actions.update('foo', () => '1961-04-12'));
    expect(input.value).toBe('1961-04-12');
  });

  it('should update with null value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(Actions.update('foo', () => null));
    expect(input.value).toBe('');
  });

  test('should update with undefined value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(Actions.update('foo', () => undefined));
    expect(input.value).toBe('');
  });

  it('should not update with wrong ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(Actions.update('bar', () => 'Bar'));
    expect(input.value).toBe('1980-06-04');
  });

  test('should not update with null ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(Actions.update(null, () => '1961-04-12'));
    expect(input.value).toBe('1980-06-04');
  });

  test('should not update with undefined ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(Actions.update(undefined, () => '1961-04-12'));
    expect(input.value).toBe('1980-06-04');
  });

  test('can be disabled', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema} enabled={false}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.disabled).toBeTruthy();
  });

  test('should be enabled by default', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialDateControl schema={schema} uischema={uischema}/>
      </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    expect(input.disabled).toBeFalsy();
  });
});
