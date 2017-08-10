import test from 'ava';
import '../helpers/setup';
import { GroupLayout } from '../../src/models/uischema';
import {
  GroupLayoutRenderer, groupTester
} from '../../src/renderers/layouts/group.layout';
import { JsonForms } from '../../src/core';
import { findRenderedDOMElementWithClass, renderIntoDocument } from 'inferno-test-utils';

test.before(t => {
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

// test('Render GroupLayout with undefined elements', t => {
//   const renderer: GroupLayoutRenderer = new GroupLayoutRenderer();
//   const uiSchema: UISchemaElement = {
//     type: 'GroupLayout'
//   };
//   renderer.setUiSchema(uischema);
//   const div = patchAndGetElement(renderer.render());
//   t.is(div.tagName, 'DIV');
//   t.is(div.className, 'group-layout');
//   t.is(div.children.length, 0);
// });
// //
test('render with label', t => {
  const uischema: GroupLayout = {
    type: 'Group',
    label: 'Foo',
    elements: [],
  };
  const tree = renderIntoDocument(<GroupLayoutRenderer uischema={uischema} />);
  const groupLayout = findRenderedDOMElementWithClass(tree, 'group-layout');
  t.is(groupLayout.tagName, 'DIV');
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
  const tree = renderIntoDocument(<GroupLayoutRenderer uischema={uischema} />);
  const groupLayout = findRenderedDOMElementWithClass(tree, 'group-layout');
  t.is(groupLayout.tagName, 'DIV');
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
  const tree = renderIntoDocument(<GroupLayoutRenderer uischema={uischema} />);
  const groupLayout = findRenderedDOMElementWithClass(tree, 'group-layout');
  t.is(groupLayout.tagName, 'DIV');
  t.is(groupLayout.children.length, 2);
});

test('hide', t => {
  const tree = renderIntoDocument(
    <GroupLayoutRenderer uischema={t.context.uischema}
                         visible={false}
    />
  );
  const groupLayout = findRenderedDOMElementWithClass(tree, 'group-layout') as HTMLDivElement;
  t.true(groupLayout.hidden);
});

test('show by default', t => {
  const tree = renderIntoDocument(<GroupLayoutRenderer uischema={t.context.uischema} />);
  const groupLayout = findRenderedDOMElementWithClass(tree, 'group-layout') as HTMLDivElement;
  t.false(groupLayout.hidden);
});
