import * as React from 'react';
import test from 'ava';
import {
  Actions,
  getData,
  jsonformsReducer,
  JsonFormsState
} from '@jsonforms/core';
import { NumberFormatField, numberFormatFieldTester } from '@jsonforms/vanilla-renderers';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';
import { combineReducers, createStore, Store } from 'redux';
import { testRenderers } from '@jsonforms/test';
import { i18nReducer } from '../src/reducers';
import { translateProps } from '../src';

export const initJsonFormsStore = ({
                                     data,
                                     schema,
                                     uischema,
                                     ...props
                                   }): Store<JsonFormsState> => {

  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer({ i18n: i18nReducer}) }),
    {
      jsonforms: {
        renderers: testRenderers,
        transformProps: [translateProps],
        ...props
      }
    }
  );

  store.dispatch(Actions.init(data, schema, uischema));

  return store;
};

test.beforeEach(t => {
  t.context.data =  { 'money': 123456 };
  t.context.schema = {
    type: 'object',
    properties: {
      money: { type: 'number'}
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
});
test('tester', t => {
  t.is(numberFormatFieldTester(undefined, undefined), -1);
  t.is(numberFormatFieldTester(null, undefined), -1);
  t.is(numberFormatFieldTester({type: 'Foo'}, undefined), -1);
  t.is(numberFormatFieldTester({type: 'Control'}, undefined), -1);
});

test('render', t => {
  const store = initJsonFormsStore({
    data: { money: 123456 },
    schema: t.context.schema,
    uischema: t.context.uischema,
    i18n: {
      locale: t.context.locale,
    }
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
    i18n: {
      locale: t.context.locale,
    }
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
  t.is(getData(store.getState()).money, 123456.7);
});

test.cb('update via input event, with decimal separator and without decimal numbers', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    i18n: {
      locale: t.context.locale,
    }
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  input.value = '123456.';
  TestUtils.Simulate.change(input);
  t.is(input.value, '123,456');
  t.is(getData(store.getState()).money, 123456);
  t.end();
});

test.cb('update via action', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    i18n: {
      locale: t.context.locale,
    }
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(Actions.update('money', () => 1234567));
  setTimeout(
    () => {
      t.is(input.value, '1,234,567');
      t.is(getData(store.getState()).money, 1234567);
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
    i18n: {
      locale: t.context.locale,
    }
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(Actions.update('money', () => 123456.77));
  setTimeout(
    () => {
      t.is(getData(store.getState()).money, 123456.77);
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
    i18n: {
      locale: t.context.locale,
    }
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(Actions.update('money', () => undefined));
  t.is(input.value, '');
});

test('update with null value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    i18n: {
      locale: t.context.locale,
    }
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(Actions.update('money', () => null));
  t.is(input.value, '');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    i18n: {
      locale: t.context.locale,
    }
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(Actions.update('balance', () => '76543.21'));
  t.is(input.value, '123,456');
});

test('update with null ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    i18n: {
      locale: t.context.locale,
    }
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(Actions.update(null, () => '76543.21'));
  t.is(input.value, '123,456');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    i18n: {
      locale: t.context.locale,
    }
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <NumberFormatField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(Actions.update(undefined, () => '76543.21'));
  t.is(input.value, '123,456');
});
