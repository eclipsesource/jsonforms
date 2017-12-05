import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import TimeControl, { timeControlTester } from '../../src/renderers/controls/time.control';
import { JsonForms } from '../../src/core';
import { initJsonFormsStore } from '../helpers/setup';
import { getData } from '../../src/reducers/index';
import { update, validate } from '../../src/actions';
import {
  change,
  findRenderedDOMElementWithClass,
  findRenderedDOMElementWithTag,
  renderIntoDocument
} from '../helpers/test';
import { Provider } from '../../src/common/binding';

test.before(() => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'control',
      classNames: ['control']
    },
    {
      name: 'control.validation',
      classNames: ['validation']
    }
  ]);
});

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
    scope: {
      $ref: '#/properties/foo',
    },
  };
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
    2,
  );
});

test('render', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );

  const control = findRenderedDOMElementWithClass(tree, 'control');
  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  const validation = findRenderedDOMElementWithClass(tree, 'validation');

  t.not(control, undefined);
  t.is(control.childNodes.length, 3);
  t.not(findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
  t.not(findRenderedDOMElementWithClass(tree, 'valid'), undefined);
  t.is(label.textContent, 'Foo');
  t.is(input.type, 'time');
  t.is(input.value, '13:37');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('render without label', t => {
  const uischema = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo',
    },
    label: false,
  };
  const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                   uischema={uischema}
      />
    </Provider>
  );

  const control = findRenderedDOMElementWithClass(tree, 'control');
  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  const validation = findRenderedDOMElementWithClass(tree, 'validation');

  t.not(control, undefined);
  t.is(control.childNodes.length, 3);
  t.not(findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
  t.not(findRenderedDOMElementWithClass(tree, 'valid'), undefined);
  t.is(label.textContent, '');
  t.is(input.type, 'time');
  t.is(input.value, '13:37');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('update via event', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = '20:15';
  change(input);
  setTimeout(() => t.is(getData(store.getState()).foo, '20:15'), 100);
});

test('update via action', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => '20:15'));
  setTimeout(() => t.is(input.value, '20:15'), 100);
});

test.failing('update with null value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = '';
  change(input);
  // FIXME: how does reset of time value look like?
  t.is(getData(store.getState()).foo, '23:59');
});

test.failing('update with undefined value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = undefined;
  change(input);
  t.is(getData(store.getState()).foo, '23:59');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = undefined;
  change(input);
  store.dispatch(
    update(
      'bar',
      () => 'Bar'
  ));
  t.is(input.value, 'undefined');
});

test('update with null ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = undefined;
  change(input);
  store.dispatch(
    update(
      null,
      () => '20:15'
    ));
  t.is(input.value, 'undefined');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = undefined;
  change(input);
  store.dispatch(
    update(
      undefined,
      () => '20:15'
    ));
  t.is(input.value, 'undefined');
});

test('hide', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                      uischema={t.context.uischema}
                      visible={false}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.true(input.hidden);
});

test('show by default', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                      uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.hidden);
});

test('disable', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                      uischema={t.context.uischema}
                      enabled={false}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.true(input.disabled);
});

test('enabled by default', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                      uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.disabled);
});

test('single error', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                      uischema={t.context.uischema}

      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 2));
  store.dispatch(validate());
  t.is(validation.textContent, 'should be string');
});

test('multiple errors', t => {
  const schema = {
    'type': 'object',
    'properties': {
      'foo': {
        'type': 'string',
        'format': 'time',
        'enum': ['16:19']
      }
    }
  };
  const store = initJsonFormsStore(t.context.data, schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                      uischema={t.context.uischema}

      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 3));
  store.dispatch(validate());
  t.is(
    validation.textContent,
    'should be string\nshould be equal to one of the allowed values'
  );
});

test('empty errors by default', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                      uischema={t.context.uischema}

      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  t.is(validation.textContent, '');
});

test('reset validation message', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TimeControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 3));
  store.dispatch(
    update(
      'foo',
      () => '20:15'
    )
  );
  store.dispatch(validate());
  t.is(validation.textContent, '');
});
