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
import MaterialTimeControl, { timeControlTester } from '../../src/controls/MaterialTimeControl';
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
    scope: '#/properties/foo',
  };
  t.context.locale = 'en-US';
});
test('autofocus on first element', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      firstTime: { type: 'string', format: 'time' },
      secondTime: { type: 'string', format: 'time' }
    }
  };
  const firstControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/firstTime',
    options: {
      focus: true
    }
  };
  const secondControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/secondTime',
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
    'firstTime': '13:37',
    'secondTime': '13:37'
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
      <MaterialTimeControl schema={t.context.schema} uischema={uischema}/>
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
      <MaterialTimeControl schema={t.context.schema} uischema={uischema}/>
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
    uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <MaterialTimeControl schema={t.context.schema} uischema={uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.autofocus);
});

test('tester', t => {
  t.is(timeControlTester(undefined, undefined), -1);
  t.is(timeControlTester(null, undefined), -1);
  t.is(timeControlTester({ type: 'Foo' }, undefined), -1);
  t.is(timeControlTester({ type: 'Control' }, undefined), -1);
});

test('tester with wrong prop type', t => {
  t.is(
    timeControlTester(
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
    timeControlTester(
      t.context.uischema,
      {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          bar: {
            type: 'string',
            format: 'time',
          },
        },
      },
    ),
    -1,
  );
});

test('tester with correct prop type', t => {
  t.is(
    timeControlTester(
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
    4,
  );
});

test('render', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale
});
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <MaterialTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.type, 'text');
  t.is(input.value, '1:37 PM');
});

test.cb('update via event', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <MaterialTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  input.value = '3:29 AM';
  TestUtils.Simulate.change(input);
  setTimeout(
    () => {
      t.is(getData(store.getState()).foo, '03:29');
      t.end();
    },
    100
  );
});

test.cb('update via action', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <MaterialTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => '3:29'));
  setTimeout(
    () => {
      t.is(input.value, '3:29 AM');
      t.end();
    },
    100
  );
});

test('update with null value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <MaterialTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
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
    uischema: t.context.uischema,
    locale: t.context.locale
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <MaterialTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
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
    uischema: t.context.uischema,
    locale: t.context.locale
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <MaterialTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('bar', () => 'Bar'));
  t.is(input.value, '1:37 PM');
});

test('update with null ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <MaterialTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(null, () => '3:29'));
  t.is(input.value, '1:37 PM');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <MaterialTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(undefined, () => '3:29'));
  t.is(input.value, '1:37 PM');
});

test('disable', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <MaterialTimeControl schema={t.context.schema} uischema={t.context.uischema} enabled={false}/>
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
      <MaterialTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.disabled);
});