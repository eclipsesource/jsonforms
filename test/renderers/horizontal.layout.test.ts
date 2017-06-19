import test from 'ava';
// inject window, document etc.
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare var global;
installCE(global, 'force');
import {HorizontalLayout} from '../../src/models/uischema';
import {HorizontalLayoutRenderer, horizontalLayoutTester}
  from '../../src/renderers/layouts/horizontal.layout';
import {Runtime, RUNTIME_TYPE} from '../../src/core/runtime';


test('HorizontalLayout tester', t => {
  t.is(
      horizontalLayoutTester(undefined, undefined),
      -1
  );
  t.is(
      horizontalLayoutTester(null, undefined),
      -1
  );
  t.is(
      horizontalLayoutTester({ type: 'Foo' }, undefined),
      -1
  );
  t.is(
      horizontalLayoutTester({ type: 'HorizontalLayout' }, undefined),
      1
  );
});
test('Render HorizontalLayout with undefined elements', t => {
  const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
  renderer.setUiSchema({type: 'HorizontalLayout'} as HorizontalLayout);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'horizontal-layout');
  t.is(div.children.length, 0);
});
test('Render HorizontalLayout with null elements', t => {
  const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
  renderer.setUiSchema({type: 'HorizontalLayout', elements: null} as HorizontalLayout);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'horizontal-layout');
  t.is(div.children.length, 0);
});
test('Render HorizontalLayout with children', t => {
  const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
  renderer.setUiSchema({type: 'HorizontalLayout',
    elements: [{type: 'Control'}, {type: 'Control'}]} as HorizontalLayout);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'horizontal-layout');
  t.is(div.children.length, 2);
});
test('Hide HorizontalLayout', t => {
  const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
  const horizontalLayout = {type: 'HorizontalLayout',
    elements: [{type: 'Control'}]} as HorizontalLayout;
  renderer.setUiSchema(horizontalLayout);
  renderer.connectedCallback();
  const runtime = <Runtime>horizontalLayout['runtime'];
  runtime.visible = false;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'horizontal-layout');
  t.is(renderer.hidden, true);
});
test('Disable HorizontalLayout', t => {
  const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
  const horizontalLayout = {type: 'HorizontalLayout',
    elements: [{type: 'Control'}]} as HorizontalLayout;
  renderer.setUiSchema(horizontalLayout);
  renderer.connectedCallback();
  const runtime = <Runtime>horizontalLayout['runtime'];
  runtime.enabled = false;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'horizontal-layout');
  t.is(div.getAttribute('disabled'), 'true');
});
test('Enable HorizontalLayout', t => {
  const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
  const horizontalLayout = {type: 'HorizontalLayout',
    elements: [{type: 'Control'}]} as HorizontalLayout;
  renderer.setUiSchema(horizontalLayout);
  renderer.connectedCallback();
  const runtime = <Runtime>horizontalLayout['runtime'];
  runtime.enabled = true;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'horizontal-layout');
  t.false(div.hasAttribute('disabled'));
});
test('HorizontalLayout should not be hidden if disconnected', t => {
  const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
  const horizontalLayout = {type: 'HorizontalLayout',
    elements: [{type: 'Control'}]} as HorizontalLayout;
  renderer.setUiSchema(horizontalLayout);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>horizontalLayout['runtime'];
  runtime.visible = false;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'horizontal-layout');
  t.is(renderer.hidden, false);
});
