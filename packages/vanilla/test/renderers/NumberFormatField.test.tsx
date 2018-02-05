import { initJsonFormsStore } from '@jsonforms/test';
import * as React from 'react';
import test from 'ava';
import {
  getData,
  update
} from '@jsonforms/core';
import NumberFormatField, { numberFormatFieldTester } from '../../src/fields/NumberFormatField';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';

test.beforeEach(t => {
  t.context.data =  { 'money': '123456' };
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
  t.context.locale = 'en-US';
  t.context.numberSeparators = {
    'en-US': {
      decimalSeparator: '.',
      thousandsSeparator: ','
    }
  };
});
test('tester', t => {
  t.is(numberFormatFieldTester(undefined, undefined), -1);
  t.is(numberFormatFieldTester(null, undefined), -1);
  t.is(numberFormatFieldTester({type: 'Foo'}, undefined), -1);
  t.is(numberFormatFieldTester({type: 'Control'}, undefined), -1);
});

test('render', t => {
  const store = initJsonFormsStore({
    data: { money: '123456' },
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberSeparators: t.context.numberSeparators
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, '123,456');
});

test('update via input event', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberSeparators: t.context.numberSeparators
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  input.value = '123456.7';
  TestUtils.Simulate.change(input);
  t.is(input.value, '123,456.7');
});

test.cb('update via input event, with decimal separator and without decimal numbers', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberSeparators: t.context.numberSeparators
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  input.value = '123456.';
  TestUtils.Simulate.change(input);
  t.is(input.value, '123,456.');
  t.is(getData(store.getState()).money, '123456.');
  t.end();
});

test.cb('update via action', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberSeparators: t.context.numberSeparators
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('money', () => '1234567'));
  setTimeout(
    () => {
      t.is(input.value, '1,234,567');
      t.is(getData(store.getState()).money, '1234567');
      t.end();
    },
    100
  );
});

test.cb('update via action, with decimal separator and decimal numbers', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberSeparators: t.context.numberSeparators
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('money', () => '123456.77'));
  setTimeout(
    () => {
      t.is(getData(store.getState()).money, '123456.77');
      t.is(input.value, '123,456.77');
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
    numberSeparators: t.context.numberSeparators
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
    numberSeparators: t.context.numberSeparators
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
    numberSeparators: t.context.numberSeparators
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('balance', () => '76543.21'));
  t.is(input.value, '123,456');
});

test('update with null ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberSeparators: t.context.numberSeparators
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(null, () => '76543.21'));
  t.is(input.value, '123,456');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    locale: t.context.locale,
    numberSeparators: t.context.numberSeparators
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(undefined, () => '76543.21'));
  t.is(input.value, '123,456');
});
