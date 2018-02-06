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
import DateTimeControl, { datetimeControlTester } from '../../src/controls/MaterialDateTimeControl';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';
import * as moment from 'moment';

test.beforeEach(t => {
  t.context.data = { 'foo': moment('1980-04-04 13:37').format() };
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        format: 'date-time'
      },
    },
  };
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/foo',
  };
});
test.failing('autofocus on first element', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            firstDateTime: { type: 'string', format: 'date-time' },
            secondDateTime: { type: 'string', format: 'date-time' }
        }
    };
    const firstControlElement: ControlElement = {
        type: 'Control',
        scope: '#/properties/firstDateTime',
        options: {
            focus: true
        }
    };
    const secondControlElement: ControlElement = {
        type: 'Control',
        scope: '#/properties/secondDateTime',
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
        'firstDateTime': moment('1980-04-04 13:37').format(),
        'secondDateTime': moment('1980-04-04 13:37').format()
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
    const inputs = TestUtils.scryRenderedDOMElementsWithTag(tree, 'input');
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
          <DateTimeControl schema={t.context.schema} uischema={uischema}/>
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
          <DateTimeControl schema={t.context.schema} uischema={uischema}/>
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
    })
    const tree = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <DateTimeControl schema={t.context.schema} uischema={uischema}/>
        </Provider>
    );
    const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
    t.false(input.autofocus);
});

test('tester', t => {
  t.is(datetimeControlTester(undefined, undefined), -1);
  t.is(datetimeControlTester(null, undefined), -1);
  t.is(datetimeControlTester({ type: 'Foo' }, undefined), -1);
  t.is(datetimeControlTester({ type: 'Control' }, undefined), -1);
});

test('tester with wrong prop type', t => {
  t.is(
      datetimeControlTester(
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
      datetimeControlTester(
          t.context.uischema,
          {
            type: 'object',
            properties: {
              foo: { type: 'string' },
              bar: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
      ),
      -1,
  );
});

test('tester with correct prop type', t => {
  t.is(
    datetimeControlTester(
      t.context.uischema,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            format: 'date-time',
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
      <DateTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.type, 'text');
  t.is(input.value, '04/04/1980 1:37 pm');
});

test.cb('update via event', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  })
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <DateTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  input.value = '04/12/1961 8:15 pm';
  TestUtils.Simulate.change(input);
  setTimeout(
    () => {
      t.is(getData(store.getState()).foo, moment('1961-04-12 20:15').format());
      t.end();
    },
    100
  );
});

test.cb('update via action', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  })
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <DateTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => moment('1961-04-12 20:15').format()));
  setTimeout(
    () => {
      t.is(input.value, '04/12/1961 8:15 pm');
      t.end();
    },
    100
  );
});

test('update with null value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  })
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <DateTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
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
  })
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <DateTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
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
  })
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <DateTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('bar', () => 'Bar'));
  t.is(input.value, '04/04/1980 1:37 pm');
});

test('update with null ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <DateTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(null, () => '12.04.1961 20:15'));
  t.is(input.value, '04/04/1980 1:37 pm');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <DateTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(undefined, () => '12.04.1961 20:15'));
  t.is(input.value, '04/04/1980 1:37 pm');
});

test('disable', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <DateTimeControl schema={t.context.schema} uischema={t.context.uischema} enabled={false}/>
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
      <DateTimeControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.disabled);
});
