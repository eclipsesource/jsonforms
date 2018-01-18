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
import HorizontalLayoutRenderer from '../../src/layouts/MaterialHorizontalLayout';
import DateTimeField, { datetimeFieldTester } from '../../src/fields/material-datetime.field';
import {
  change,
  findRenderedDOMElementWithTag,
  renderIntoDocument,
  scryRenderedDOMElementsWithTag
} from '../../../test/helpers/binding';
import { Provider } from 'react-redux';
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
    scope: {
      $ref: '#/properties/foo',
    },
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
        scope: {
            $ref: '#/properties/firstDateTime'
        },
        options: {
            focus: true
        }
    };
    const secondControlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/secondDateTime'
        },
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
        scope: {
            $ref: '#/properties/foo'
        },
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
          <DateTimeField schema={t.context.schema} uischema={uischema}/>
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.is(document.activeElement, input);
});

test('autofocus inactive', t => {
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
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
          <DateTimeField schema={t.context.schema} uischema={uischema}/>
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.false(input.autofocus);
});

test('autofocus inactive by default', t => {
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    const store = initJsonFormsStore({
      data: t.context.data,
      schema: t.context.schema,
      uischema
    })
    const tree = renderIntoDocument(
        <Provider store={store}>
          <DateTimeField schema={t.context.schema} uischema={uischema}/>
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.false(input.autofocus);
});

test('tester', t => {
  t.is(datetimeFieldTester(undefined, undefined), -1);
  t.is(datetimeFieldTester(null, undefined), -1);
  t.is(datetimeFieldTester({ type: 'Foo' }, undefined), -1);
  t.is(datetimeFieldTester({ type: 'Control' }, undefined), -1);
});

test('tester with wrong prop type', t => {
  t.is(
      datetimeFieldTester(
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
      datetimeFieldTester(
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
    datetimeFieldTester(
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
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateTimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.type, 'text');
  t.is(input.value, '04.04.1980 13:37');
});

test.cb('update via event', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  })
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateTimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = '12.04.1961 20:15';
  change(input);
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
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateTimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => moment('1961-04-12 20:15').format()));
  setTimeout(
    () => {
      t.is(input.value, '12.04.1961 20:15');
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
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateTimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => null));
  t.is(input.value, '');
});

test('update with undefined value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  })
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateTimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => undefined));
  t.is(input.value, '');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  })
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateTimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('bar', () => 'Bar'));
  t.is(input.value, '04.04.1980 13:37');
});

test('update with null ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateTimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(null, () => '12.04.1961 20:15'));
  t.is(input.value, '04.04.1980 13:37');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateTimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(undefined, () => '12.04.1961 20:15'));
  t.is(input.value, '04.04.1980 13:37');
});

test('disable', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateTimeField schema={t.context.schema} uischema={t.context.uischema} enabled={false}/>
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
      <DateTimeField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.disabled);
});
