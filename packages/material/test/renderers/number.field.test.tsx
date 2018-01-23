import '../../../test/helpers/setup';
import * as React from 'react';
import test from 'ava';
import {
  ControlElement,
  getData,
  HorizontalLayout,
  initJsonFormsStore,
  JsonSchema,
  update
} from '@jsonforms/core';
import NumberField, { numberFieldTester } from '../../src/fields/material-number.field';
import HorizontalLayoutRenderer from '../../src/layouts/MaterialHorizontalLayout';
import {
  change,
  findRenderedDOMElementWithTag,
  renderIntoDocument,
  scryRenderedDOMElementsWithTag
} from '../../../test/helpers/binding';
import { Provider } from 'react-redux';

test.beforeEach(t => {
  t.context.data = {'foo': 3.14};
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'number',
        minimum: 5
      },
    },
  };
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/foo'
  };
});
test.failing('autofocus on first element', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      firstNumberField: { type: 'number', minimum: 5 },
      secondNumberField: { type: 'number', minimum: 5 }
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
  const uischema: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: [
      firstControlElement,
      secondControlElement
    ]
  };
  const data = {
    'firstNumberField': 3.14,
    'secondNumberField': 5.12
  };
  const store = initJsonFormsStore({
    data,
    schema,
    uischema
  });

  const tree = renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer schema={schema} uischema={uischema}/>
    </Provider>
  );

  const inputs = scryRenderedDOMElementsWithTag(tree, 'input');
  t.not(document.activeElement, inputs[0]);
  t.is(document.activeElement, inputs[1]);
});

test('autofocus active', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    options: {
      focus: true
    }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberField schema={t.context.schema} uischema={uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(document.activeElement, input);
});

test('autofocus inactive', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    options: {
      focus: false
    }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberField schema={t.context.schema} uischema={uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.autofocus);
});

test('autofocus inactive by default', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberField schema={t.context.schema} uischema={uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.autofocus);
});

test('tester', t => {
  t.is(numberFieldTester(undefined, undefined), -1);
  t.is(numberFieldTester(null, undefined), -1);
  t.is(numberFieldTester({type: 'Foo'}, undefined), -1);
  t.is(numberFieldTester({type: 'Control'}, undefined), -1);
});

test('tester with wrong schema type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.is(
    numberFieldTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          }
        }
      }
    ),
    -1
  );
});

test('tester with wrong schema type, but sibling has correct one', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.is(
    numberFieldTester(
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
    ),
    -1
  );
});

test('tester with machting schema type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.is(
    numberFieldTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'number'
          }
        }
      }
    ),
    2
  );
});

test('render', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'number'
      }
    }
  };
  const store = initJsonFormsStore({
    data: { 'foo': 3.14 },
    schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberField schema={schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.type, 'number');
  t.is(input.step, '0.1');
  t.is(input.value, '3.14');
});

test('update via input event', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = '2.72';
  change(input);
  t.is(getData(store.getState()).foo, 2.72);
});

test('update via action', t => {
  const store = initJsonFormsStore({
    data: { 'foo': 2.72 },
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, '2.72');
  store.dispatch(update('foo', () => 3.14));
  setTimeout(() => t.is(input.value, 'Bar'), 3.14);
});

test('update with undefined value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => undefined));
  t.is(input.value, '');
});

test('update with null value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => null));
  t.is(input.value, '');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('bar', () => 11));
  t.is(input.value, '3.14');
});

test('update with null ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(null, () => 2.72));
  t.is(input.value, '3.14');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  store.dispatch(update(undefined, () => 13));
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, '3.14');
});

test('disable', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberField schema={t.context.schema} uischema={t.context.uischema} enabled={false}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.true(input.disabled);
});

test('enabled by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.disabled);
});
