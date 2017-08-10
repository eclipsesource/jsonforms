import test from 'ava';
import { Provider } from 'inferno-redux';
import { initJsonFormsStore } from '../helpers/setup';
import { JsonForms } from '../../src/core';
import { LabelElement, UISchemaElement } from '../../src/models/uischema';
import LabelRenderer, { labelRendererTester } from '../../src/renderers/additional/label.renderer';
import { findRenderedDOMElementWithTag, renderIntoDocument } from 'inferno-test-utils';

test.before(() => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'label-control',
      classNames: ['jsf-label']
    }
  ]);
});

test.beforeEach(t => {
  t.context.data =  {'name': 'Foo'};
  t.context.schema = {type: 'object', properties: {name: {type: 'string'}}};
  t.context.uischema = {type: 'Label', text: 'Bar'};
});

test('tester', t => {
  t.is(labelRendererTester(undefined, undefined), -1);
  t.is(labelRendererTester(null, undefined), -1);
  t.is(labelRendererTester({type: 'Foo'}, undefined), -1);
  t.is(labelRendererTester({type: 'Label'}, undefined), 1);
});

test('render with undefined text', t => {
  const uischema: UISchemaElement = { type: 'Label' };
  const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <LabelRenderer schema={t.context.schema}
                     uischema={uischema}
      />
    </Provider>
  );

  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.className, 'jsf-label');
  t.is(label.textContent, '');
});

test('render with null text', t => {
  const uischema: LabelElement = {
    type: 'Label',
    text: null
  };
  const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <LabelRenderer schema={t.context.schema}
                     uischema={uischema}
      />
    </Provider>
  );
  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.className, 'jsf-label');
  t.is(label.textContent, '');
});

test('render with text', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <LabelRenderer schema={t.context.schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );
  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.className, 'jsf-label');
  t.is(label.childNodes.length, 1);
  t.is(label.textContent, 'Bar');
});

test('hide', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <LabelRenderer schema={t.context.schema}
                     uischema={t.context.uischema}
                     visible={false}
      />
    </Provider>
  );
  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  t.true(label.hidden);
});

test('show by default', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <LabelRenderer schema={t.context.schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );
  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  t.false(label.hidden);
});
