import { initJsonFormsStore } from '@jsonforms/test';
import * as React from 'react';
import test from 'ava';
import {
  ControlElement,
  getData,
  HorizontalLayout,
  JsonSchema,
  update
} from '@jsonforms/core';
import HorizontalLayoutRenderer from '../../src/layouts/MaterialHorizontalLayout';
import TimeField, { materialTimeFieldTester } from '../../src/fields/MaterialTimeField';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';

test.beforeEach(t => {
  t.context.data = { 'foo': '13:37' };
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        format: 'time'
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
  const uischema: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: [
      firstControlElement,
      secondControlElement
    ]
  };
  const data = {
    'firstDate': '1980-04-04',
    'secondDate': '1980-04-04'
  };
  const store = initJsonFormsStore({
    data,
    schema,
    uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer schema={schema} uischema={uischema}/>
    </Provider>
  );
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TimeField schema={t.context.schema} uischema={uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TimeField schema={t.context.schema} uischema={uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
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
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TimeField schema={t.context.schema} uischema={uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.autofocus);
});

test('tester', t => {
  t.is(materialTimeFieldTester(undefined, undefined), -1);
  t.is(materialTimeFieldTester(null, undefined), -1);
  t.is(materialTimeFieldTester({ type: 'Foo' }, undefined), -1);
  t.is(materialTimeFieldTester({ type: 'Control' }, undefined), -1);
});

test('tester with wrong prop type', t => {
  t.is(
    materialTimeFieldTester(
      t.context.uischmea,
      {
        type: 'object',
        properties: {
          foo: { type: 'string' },
        },
      },
    ),
    -1,
  );
});

test('tester with wrong prop type, but sibling has correct one', t => {
  t.is(
    materialTimeFieldTester(
      t.context.uischema,
      {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          bar: {
            type: 'string',
            format: 'time'
          },
        },
      },
    ),
    -1,
  );
});

test('tester with correct prop type', t => {
  t.is(
    materialTimeFieldTester(
      t.context.uischema,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            format: 'time',
          },
        },
      },
    ),
    2,
  );
});

test('render', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.type, 'time');
  t.is(input.value, '13:37');
});

test.cb('update via event', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  input.value = '20:15';
  TestUtils.Simulate.change(input);
  setTimeout(() => {t.is(getData(store.getState()).foo, '20:15'); t.end(); }, 100);
});

test.cb('update via action', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => '20:15'));
  setTimeout(() => {t.is(input.value, '20:15'); t.end(); }, 100);
});

test('update with null value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => null));
  t.is(input.value, '');
});

test('update with undefined value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => undefined));
  t.is(input.value, '');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('bar', () => 'Bar'));
  t.is(input.value, '13:37');
});

test('update with null ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(null, () => '20:15'));
  t.is(input.value, '13:37');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(undefined, () => '20:15'));
  t.is(input.value, '13:37');
});

test('disable', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TimeField schema={t.context.schema} uischema={t.context.uischema} enabled={false}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.true(input.disabled);
});

test('enabled by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.disabled);
});
