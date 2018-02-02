import '@jsonforms/test';
import * as React from 'react';
import test from 'ava';
import { GroupLayout } from '@jsonforms/core';
import { Provider } from 'react-redux';
import GroupLayoutRenderer, { groupTester } from '../../src/layouts/GroupLayout';
import * as TestUtils from 'react-dom/test-utils';
import { initJsonFormsVanillaStore } from '../vanillaStore';

test.beforeEach(t => {
  t.context.uischema = {
    type: 'GroupLayout',
    elements: [{type: 'Control'}]
  };
  t.context.styles = [
    {
      name: 'group-layout',
      classNames: ['group-layout']
    }
  ];
});

test('tester', t => {
  t.is(groupTester(undefined, undefined), -1);
  t.is(groupTester(null, undefined), -1);
  t.is(groupTester({type: 'Foo'}, undefined), -1);
  t.is(groupTester({type: 'Group'}, undefined), 1);
});

test('render with label', t => {
  const uischema: GroupLayout = {
    type: 'Group',
    label: 'Foo',
    elements: [],
  };
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: {},
    uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <GroupLayoutRenderer uischema={uischema} />
    </Provider>
  );
  const groupLayout = TestUtils.findRenderedDOMComponentWithClass(tree, 'group-layout');
  t.is(groupLayout.tagName, 'FIELDSET');
  t.is(groupLayout.className, 'group-layout');
  t.is(groupLayout.children.length, 1);
  const legend = groupLayout.children[0];
  t.is(legend.tagName, 'LEGEND');
  t.is(legend.textContent, 'Foo');
});

test('render with null elements', t => {
  const uischema: GroupLayout = {
    type: 'Group',
    elements: null
  };
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: {},
    uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <GroupLayoutRenderer uischema={uischema} />
    </Provider>
  );
  const groupLayout = TestUtils.findRenderedDOMComponentWithClass(tree, 'group-layout');
  t.is(groupLayout.tagName, 'FIELDSET');
  t.is(groupLayout.children.length, 0);
});

test('render with children', t => {
  const uischema: GroupLayout = {
    type: 'Group',
    elements: [
      {type: 'Control'},
      {type: 'Control'}
    ]
  };
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: {},
    uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <GroupLayoutRenderer uischema={uischema} />
    </Provider>
  );
  const groupLayout = TestUtils.findRenderedDOMComponentWithClass(tree, 'group-layout');
  t.is(groupLayout.tagName, 'FIELDSET');
  t.is(groupLayout.children.length, 2);
});

test('hide', t => {
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: {},
    uischema: t.context.uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <GroupLayoutRenderer
        uischema={t.context.uischema}
        visible={false}
      />
    </Provider>
  );
  const groupLayout = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'group-layout'
  ) as HTMLDivElement;
  t.true(groupLayout.hidden);
});

test('show by default', t => {
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: {},
    uischema: t.context.uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <GroupLayoutRenderer uischema={t.context.uischema} />
    </Provider>
  );
  const groupLayout = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'group-layout'
  ) as HTMLDivElement;
  t.false(groupLayout.hidden);
});
