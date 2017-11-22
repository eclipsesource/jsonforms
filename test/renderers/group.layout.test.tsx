import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import { initJsonFormsStore } from '../helpers/setup';
import { GroupLayout } from '../../src/models/uischema';
import GroupLayoutRenderer, {
  groupTester
} from '../../src/renderers/layouts/group.layout';
import { JsonForms } from '../../src/core';
import { Provider } from '../../src/common/binding';
import {findRenderedDOMElementWithClass, renderIntoDocument} from "../helpers/test";

test.before(() => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'group-layout',
      classNames: ['group-layout']
    }
  ]);
});

test.beforeEach(t => {
  t.context.uischema = {
    type: 'GroupLayout',
    elements: [{type: 'Control'}]
  };
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
  const store = initJsonFormsStore({}, {}, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <GroupLayoutRenderer uischema={uischema} />
    </Provider>
  );
  const groupLayout = findRenderedDOMElementWithClass(tree, 'group-layout');
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
  const store = initJsonFormsStore({}, {}, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <GroupLayoutRenderer uischema={uischema} />
    </Provider>
  );
  const groupLayout = findRenderedDOMElementWithClass(tree, 'group-layout');
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
  const store = initJsonFormsStore({}, {}, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <GroupLayoutRenderer uischema={uischema} />
    </Provider>
  );
  const groupLayout = findRenderedDOMElementWithClass(tree, 'group-layout');
  t.is(groupLayout.tagName, 'FIELDSET');
  t.is(groupLayout.children.length, 2);
});

test('hide', t => {
  const store = initJsonFormsStore({}, {}, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <GroupLayoutRenderer uischema={t.context.uischema}
                           visible={false}
      />
    </Provider>
  );
  const groupLayout = findRenderedDOMElementWithClass(tree, 'group-layout') as HTMLDivElement;
  t.true(groupLayout.hidden);
});

test('show by default', t => {
  const store = initJsonFormsStore({}, {}, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <GroupLayoutRenderer uischema={t.context.uischema} />
    </Provider>
  );
  const groupLayout = findRenderedDOMElementWithClass(tree, 'group-layout') as HTMLDivElement;
  t.false(groupLayout.hidden);
});
