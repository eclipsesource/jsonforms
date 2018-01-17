import * as React from 'react';
import { initJsonFormsStore } from '../../../test/helpers/setup';
import test from 'ava';
import { MasterDetailLayout, update } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/core';
import {
  findRenderedDOMElementWithClass,
  renderIntoDocument
} from '../../../test/helpers/binding';
import { Provider } from 'react-redux';
import TreeMasterDetail from '../../src/additional/tree';
import {
  findRenderedDOMElementWithTag,
  scryRenderedDOMElementsWithClass
} from '../../../test/helpers/react-test';
import { treeMasterDetailTester } from '../../src/additional/tree/tester';

test.beforeEach(t => {
  t.context.data = { name: 'Foo', children: [{name: 'Bar'}] };
  t.context.schema = {
    type: 'object',
    properties: {
      children: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string'} }
        }
      },
      name: { type: 'string'}
    }
  };

  t.context.uischema = {
    type: 'MasterDetailLayout',
    label: 'FooBar',
    scope:  { $ref: '#/properties/children' },
    options: {}
  };
});

test('tester - sanity checks', t => {
  t.is(treeMasterDetailTester(undefined, undefined), -1);
  t.is(treeMasterDetailTester(null, undefined), -1);
  t.is(treeMasterDetailTester({ type: 'MasterDetailLayout' }, undefined), -1);
});

test('tester', t => {
  t.is(
    treeMasterDetailTester(
      t.context.uischema,
      undefined
    ),
    2
  );
});

test('tester with unknown control', t => {
  const unknownControl = {
    type: 'Foo',
    scope: { $ref: '/properties/foo' }
  };
  t.is(
    treeMasterDetailTester(
      unknownControl,
      undefined
    ),
    -1
  );
});

test('tester with null scope', t => {
  const masterDetailLayout: MasterDetailLayout = {
    type: 'MasterDetailLayout',
    scope: null
  };
  t.is(
    treeMasterDetailTester(
      masterDetailLayout,
      undefined
    ),
    -1
  );
});

test('tester with empty scope', t => {
  const masterDetailLayout = {
    type: 'MasterDetailLayout',
    scope: { }
  };
  t.is(
    treeMasterDetailTester(
      masterDetailLayout,
      undefined
    ),
    -1
  );
});

test('tester with null $ref', t => {
  const masterDetailLayout: MasterDetailLayout = {
    type: 'MasterDetailLayout',
    scope: { $ref: null }
  };
  t.is(
    treeMasterDetailTester(
      masterDetailLayout,
      undefined
    ),
    -1
  );
});

test('update with wrong ref', t => {
  JsonForms.schema = t.context.schema;
  // TODO: can we shorten this?
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  );
  const result = findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
  const content = result.children[1] as HTMLDivElement;
  const master = content.firstElementChild as HTMLDivElement;
  const ul = master.firstElementChild;
  store.dispatch(update('name', () => 'Bar'));
  t.is(result.children.length, 3);
  t.is(master.children.length, 1);
  t.is(ul.children.length, 1);
});

test('update with null ref', t => {
  JsonForms.schema = t.context.schema;
  const data = {name: 'Foo', children: [{name: 'Bar'}]};
  const store = initJsonFormsStore({
    data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  );
  const ul = findRenderedDOMElementWithTag(tree, 'ul');
  store.dispatch(update(null, () => undefined));
  t.is(ul.children.length, 1);
});

test('update with undefined ref', t => {
  JsonForms.schema = t.context.schema;
  const data = { name: 'Foo', children: [{name: 'Bar'}] };
  const store = initJsonFormsStore({
    data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  );
  const result = findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
  const content = result.children[1] as HTMLDivElement;
  const master = content.firstElementChild as HTMLDivElement;
  const ul = master.firstElementChild;
  store.dispatch(update(undefined, () => undefined));
  t.is(result.children.length, 3);
  t.is(master.children.length, 1);
  t.is(ul.children.length, 1);
});

test('update via action', t => {
  JsonForms.schema = t.context.schema;
  const data = {name: 'Foo', children: [{name: 'Bar'}]};
  const store = initJsonFormsStore({
    data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  );
  const result = findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
  const content = result.children[1] as HTMLDivElement;
  const master = content.firstElementChild;
  const ul = master.firstElementChild;
  store.dispatch(
    update(
      'children',
      () => [
        { name: 'Bar' },
        { name: 'Doe' },
      ]
    )
  );
  const labels = scryRenderedDOMElementsWithClass(tree, 'label');

  t.is(result.children.length, 3);
  t.is(master.children.length, 1);
  t.is(ul.children.length, 2);
  t.is(labels[0].firstElementChild.textContent, 'Bar');
  t.is(labels[1].firstElementChild.textContent, 'Doe');
});

test('update with undefined value', t => {
  JsonForms.schema = t.context.schema;
  const data = {name: 'Foo', children: [{name: 'Bar'}]};
  const store = initJsonFormsStore({
    data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  );
  const result = findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
  const content = result.children[1] as HTMLDivElement;
  const master = content.firstElementChild;
  const ul = master.firstElementChild;
  store.dispatch(update('children', () => undefined));
  t.is(ul.children.length, 0);
});

test('update with null value', t => {
  JsonForms.schema = t.context.schema;
  const data = {name: 'Foo', children: [{name: 'Bar'}]};
  const store = initJsonFormsStore({
    data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  );
  const result = findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
  const content = result.children[1] as HTMLDivElement;
  const master = content.children[0] as HTMLDivElement;
  const ul = master.children[0];
  store.dispatch(update('children', () => null));

  t.is(ul.children.length, 0);
});

test('hide', t => {
  const data = {};
  const schema = { type: 'object', properties: {} };
  JsonForms.schema = schema;
  const uischema: MasterDetailLayout = {
    type: 'MasterDetailLayout',
    scope: { $ref: '#' },
  };
  const store = initJsonFormsStore({
    data,
    schema,
    uischema,
  });
  const vnode = (
    <Provider store={store}>
      <TreeMasterDetail
        schema={schema}
        uischema={uischema}
        visible={false}
      />
    </Provider>
  );
  const tree = renderIntoDocument(vnode);
  const div = findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail') as HTMLDivElement;
  t.true(div.hidden);
});

test('visible by default', t => {
  const data = {};
  const schema = { type: 'object', properties: {} };
  JsonForms.schema = schema;
  const uischema: MasterDetailLayout = {
    type: 'MasterDetailLayout',
    scope: { $ref: '#' },
  };
  const store = initJsonFormsStore({
    data,
    schema,
    uischema,
  });
  const vnode = (
    <Provider store={store}>
      <TreeMasterDetail
        schema={schema}
        uischema={uischema}
      />
    </Provider>
  );
  const tree = renderIntoDocument(vnode);
  const div = findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail') as HTMLDivElement;
  t.false(div.hidden);
});
