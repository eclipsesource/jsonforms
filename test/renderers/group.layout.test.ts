import test from 'ava';
// inject window, document etc.
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare var global;
installCE(global, 'force');
import {GroupLayout} from '../../src/models/uischema';
import {GroupLayoutRenderer, groupTester}
  from '../../src/renderers/layouts/group.layout';
import {Runtime} from '../../src/core/runtime';


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
  renderer.setUiSchema({type: 'GroupLayout'} as GroupLayout);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'FIELDSET');
  t.is(div.className, 'group-layout');
  t.is(div.children.length, 0);
});
test('Render GroupLayout with label', t => {
  const renderer: GroupLayoutRenderer = new GroupLayoutRenderer();
  renderer.setUiSchema({type: 'GroupLayout', label: 'Foo'} as GroupLayout);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'FIELDSET');
  t.is(div.className, 'group-layout');
  t.is(div.children.length, 1);
  const legend = div.children[0];
  t.is(legend.tagName, 'LEGEND');
  t.is(legend['innerText'], 'Foo');
});
test('Render GroupLayout with null elements', t => {
  const renderer: GroupLayoutRenderer = new GroupLayoutRenderer();
  renderer.setUiSchema({type: 'GroupLayout', elements: null} as GroupLayout);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'FIELDSET');
  t.is(div.className, 'group-layout');
  t.is(div.children.length, 0);
});
test('Render GroupLayout with children', t => {
  const renderer: GroupLayoutRenderer = new GroupLayoutRenderer();
  renderer.setUiSchema({type: 'GroupLayout',
    elements: [{type: 'Control'}, {type: 'Control'}]} as GroupLayout);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'FIELDSET');
  t.is(div.className, 'group-layout');
  t.is(div.children.length, 2);
});
test('Hide GroupLayout', t => {
  const renderer: GroupLayoutRenderer = new GroupLayoutRenderer();
  const groupLayout = {type: 'GroupLayout',
    elements: [{type: 'Control'}]} as GroupLayout;
  renderer.setUiSchema(groupLayout);
  renderer.connectedCallback();
  const runtime = <Runtime>groupLayout['runtime'];
  runtime.visible = false;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'FIELDSET');
  t.is(div.className, 'group-layout');
  t.is(renderer.hidden, true);
});
test('Disable GroupLayout', t => {
  const renderer: GroupLayoutRenderer = new GroupLayoutRenderer();
  const groupLayout = {type: 'GroupLayout',
    elements: [{type: 'Control'}]} as GroupLayout;
  renderer.setUiSchema(groupLayout);
  renderer.connectedCallback();
  const runtime = <Runtime>groupLayout['runtime'];
  runtime.enabled = false;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'FIELDSET');
  t.is(div.className, 'group-layout');
  t.is(div.getAttribute('disabled'), 'true');
});
test('Enable GroupLayout', t => {
  const renderer: GroupLayoutRenderer = new GroupLayoutRenderer();
  const groupLayout = {type: 'GroupLayout',
    elements: [{type: 'Control'}]} as GroupLayout;
  renderer.setUiSchema(groupLayout);
  renderer.connectedCallback();
  const runtime = <Runtime>groupLayout['runtime'];
  runtime.enabled = true;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'FIELDSET');
  t.is(div.className, 'group-layout');
  t.false(div.hasAttribute('disabled'));
});
test('GroupLayout should not be hidden if disconnected', t => {
  const renderer: GroupLayoutRenderer = new GroupLayoutRenderer();
  const groupLayout = {type: 'GroupLayout',
    elements: [{type: 'Control'}]} as GroupLayout;
  renderer.setUiSchema(groupLayout);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>groupLayout['runtime'];
  runtime.visible = false;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'FIELDSET');
  t.is(div.className, 'group-layout');
  t.is(renderer.hidden, false);
});
