import test from 'ava';
// setup import must come first
import '../helpers/setup';
/*tslint:disable */
import {GroupLayout, UISchemaElement} from '../../src/models/uischema';
/*tslint:enable */
import {
  GroupLayoutRenderer, groupTester
} from '../../src/renderers/layouts/group.layout';
import { JsonForms } from '../../src/core';
test.before(t => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'group.layout',
      classNames: ['group-layout']
    }
  ]);
});
test.beforeEach(t => {
  t.context.uiSchema = {
    type: 'GroupLayout',
    elements: [{type: 'Control'}]
  };
});

test('GroupLayout tester', t => {
  t.is(
      groupTester(undefined, undefined),
      -1
  );
  t.is(
      groupTester(null, undefined),
      -1
  );
  t.is(
      groupTester({type: 'Foo'}, undefined),
      -1
  );
  t.is(
      groupTester({type: 'Group'}, undefined),
      1
  );
});

test('Render GroupLayout with undefined elements', t => {
  const renderer: GroupLayoutRenderer = new GroupLayoutRenderer();
  const uiSchema: UISchemaElement = {
    type: 'GroupLayout'
  };
  renderer.setUiSchema(uiSchema);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'FIELDSET');
  t.is(div.className, 'group-layout');
  t.is(div.children.length, 0);
});

test('Render GroupLayout with label', t => {
  const renderer: GroupLayoutRenderer = new GroupLayoutRenderer();
  const uiSchema: GroupLayout = {
    type: 'Group',
    label: 'Foo',
    elements: [],
  };
  renderer.setUiSchema(uiSchema);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'FIELDSET');
  t.is(div.className, 'group-layout');
  t.is(div.children.length, 1);
  const legend = div.children[0];
  t.is(legend.tagName, 'LEGEND');
  // TODO: fix warning
  /*tslint:disable */
  t.is(legend['innerText'], 'Foo');
  /*tslint:enable */
});

test('Render GroupLayout with null elements', t => {
  const renderer: GroupLayoutRenderer = new GroupLayoutRenderer();
  const groupLayout: GroupLayout = {
    type: 'Group',
    elements: null
  };
  renderer.setUiSchema(groupLayout);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'FIELDSET');
  t.is(div.className, 'group-layout');
  t.is(div.children.length, 0);
});

test('Render GroupLayout with children', t => {
  const renderer: GroupLayoutRenderer = new GroupLayoutRenderer();
  const groupLayout: GroupLayout = {
    type: 'Group',
    elements: [
      {type: 'Control'},
      {type: 'Control'}
    ]
  };
  renderer.setUiSchema(groupLayout);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'FIELDSET');
  t.is(div.className, 'group-layout');
  t.is(div.children.length, 2);
});

test('Hide GroupLayout', t => {
  const renderer: GroupLayoutRenderer = new GroupLayoutRenderer();
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const runtime = t.context.uiSchema.runtime;
  runtime.visible = false;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'FIELDSET');
  t.is(div.className, 'group-layout');
  t.is(renderer.hidden, true);
});

test('Disable GroupLayout', t => {
  const renderer: GroupLayoutRenderer = new GroupLayoutRenderer();
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const runtime = t.context.uiSchema.runtime;
  runtime.enabled = false;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'FIELDSET');
  t.is(div.className, 'group-layout');
  t.is(div.getAttribute('disabled'), 'true');
});

test('Enable GroupLayout', t => {
  const renderer: GroupLayoutRenderer = new GroupLayoutRenderer();
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const runtime = t.context.uiSchema.runtime;
  runtime.enabled = true;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'FIELDSET');
  t.is(div.className, 'group-layout');
  t.false(div.hasAttribute('disabled'));
});

test('GroupLayout should not be hidden if disconnected', t => {
  const renderer: GroupLayoutRenderer = new GroupLayoutRenderer();
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = t.context.uiSchema.runtime;
  runtime.visible = false;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'FIELDSET');
  t.is(div.className, 'group-layout');
  t.is(renderer.hidden, false);
});
