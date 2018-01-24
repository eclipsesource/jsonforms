import { initJsonFormsStore } from '@jsonforms/test';
import * as React from 'react';
import test from 'ava';
import {
  LabelElement,
  UISchemaElement
} from '@jsonforms/core';
import { Provider } from 'react-redux';
import LabelRenderer, { labelRendererTester } from '../../src/additional/label.renderer';
import * as TestUtils from 'react-dom/test-utils';

test.beforeEach(t => {
  t.context.data =  {'name': 'Foo'};
  t.context.schema = {type: 'object', properties: {name: {type: 'string'}}};
  t.context.uischema = {type: 'Label', text: 'Bar'};
  t.context.styles = [
    {
      name: 'label-control',
      classNames: ['jsf-label']
    }
  ];
});

test('tester', t => {
  t.is(labelRendererTester(undefined, undefined), -1);
  t.is(labelRendererTester(null, undefined), -1);
  t.is(labelRendererTester({type: 'Foo'}, undefined), -1);
  t.is(labelRendererTester({type: 'Label'}, undefined), 1);
});

test('render with undefined text', t => {
  const uischema: UISchemaElement = { type: 'Label' };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <LabelRenderer
        schema={t.context.schema}
        uischema={uischema}
      />
    </Provider>
  );

  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.className, 'jsf-label');
  t.is(label.textContent, '');
});

test('render with null text', t => {
  const uischema: LabelElement = {
    type: 'Label',
    text: null
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema,
    styles: t.context.styles
  });

  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <LabelRenderer
        schema={t.context.schema}
        uischema={uischema}
      />
    </Provider>
  );
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.className, 'jsf-label');
  t.is(label.textContent, '');
});

test('render with text', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <LabelRenderer
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  );
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.className, 'jsf-label');
  t.is(label.childNodes.length, 1);
  t.is(label.textContent, 'Bar');
});

test('hide', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <LabelRenderer
        schema={t.context.schema}
        uischema={t.context.uischema}
        visible={false}
      />
    </Provider>
  );
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.true(label.hidden);
});

test('show by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <LabelRenderer
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  );
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.false(label.hidden);
});
