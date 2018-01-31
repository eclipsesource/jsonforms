import { initJsonFormsStore } from '@jsonforms/test';
import * as React from 'react';
import test from 'ava';
import {
  getData,
  JsonSchema,
  update
} from '@jsonforms/core';
import NumberFormatField, { numberFormatFieldTester } from '../../src/fields/MaterialNumberFormatField';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';

test.beforeEach(t => {
  t.context.data =  { 'money': '123123.44'};
  t.context.schema = {
    type: 'object',
    properties: {
      money: { type: 'string'}
    }
  };
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/money',
    options: {
      format: true
    }
  };
  t.context.styles = [
    {
      name: 'control',
      classNames: ['control']
    },
    {
      name: 'control.validation',
      classNames: ['validation']
    }
  ];
  t.context.numberFormat = {
    'de-DE': {
      '.': '',
      ',': '.'
    },
    'en-US': {
      ',': '',
      '.': '.'
    }
  };
  t.context.locale = 'en-US';
});

test('tester', t => {
  t.is(numberFormatFieldTester(undefined, undefined), -1);
  t.is(numberFormatFieldTester(null, undefined), -1);
  t.is(numberFormatFieldTester({type: 'Foo'}, undefined), -1);
  t.is(numberFormatFieldTester({type: 'Control'}, undefined), -1);
});

test('render', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      money: { type: 'string' }
    }
  };
  const store = initJsonFormsStore({
    data: { money: '123123.44' },
    schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberFormat: t.context.numberFormat
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, '123,123.44');
});

test('update via input event', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberFormat: t.context.numberFormat
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  input.value = '1,123,123.44';
  TestUtils.Simulate.change(input);
  t.is(getData(store.getState()).money, '1,123,123.44');
});

test.cb('update via input event, non integer value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberFormat: t.context.numberFormat
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  input.value = 'Foo';
  TestUtils.Simulate.change(input);
  t.is(getData(store.getState()).money, '123123.44');
  t.end();
});

test.cb('update via input event, with dot', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberFormat: t.context.numberFormat
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  input.value = '123123.';
  TestUtils.Simulate.change(input);
  t.is(getData(store.getState()).money, '123123.');
  t.end();
});

test.cb('update via input event, with comma', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberFormat: t.context.numberFormat
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  input.value = '123123,';
  TestUtils.Simulate.change(input);
  t.is(getData(store.getState()).money, '123123,');
  t.end();
});

test.cb('update via action', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberFormat: t.context.numberFormat
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('money', () => '1123123.44'));
  setTimeout(
    () => {
      t.is(input.value, '1,123,123.44');
      t.end();
    },
    100
  );
});

test('update with undefined value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberFormat: t.context.numberFormat
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('money', () => undefined));
  t.is(input.value, '');
});

test('update with null value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberFormat: t.context.numberFormat
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('money', () => null));
  t.is(input.value, '');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberFormat: t.context.numberFormat
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('balance', () => '1123123.44'));
  t.is(input.value, '123,123.44');
});

test('update with null ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberFormat: t.context.numberFormat
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(null, () => '1123123.44'));
  t.is(input.value, '123,123.44');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberFormat: t.context.numberFormat
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(undefined, () => '1123123.44'));
  t.is(input.value, '123,123.44');
});