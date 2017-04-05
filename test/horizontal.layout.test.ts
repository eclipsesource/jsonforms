import test from 'ava';
// inject window, document etc.
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare var global;
installCE(global, 'force');
import {HorizontalLayout} from '../src/models/uischema';
import {HorizontalLayoutRenderer, HorizontalLayoutRendererTester}
  from '../src/renderers/layouts/horizontal.layout';
import {Runtime, RUNTIME_TYPE} from '../src/core/runtime';


test('HorizontalLayoutRendererTester', t => {
  t.is(-1, HorizontalLayoutRendererTester(undefined));
  t.is(-1, HorizontalLayoutRendererTester(null));
  t.is(-1, HorizontalLayoutRendererTester({type: 'Foo'}));
  t.is(1, HorizontalLayoutRendererTester({type: 'HorizontalLayout'}));
});
test('HorizontalLayoutRenderer with elements undefined', t => {
  const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
  renderer.setUiSchema({type: 'HorizontalLayout'} as HorizontalLayout);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'horizontal-layout');
  t.is(div.children.length, 0);
});
test('HorizontalLayoutRenderer with elements null', t => {
  const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
  renderer.setUiSchema({type: 'HorizontalLayout', elements: null} as HorizontalLayout);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'horizontal-layout');
  t.is(div.children.length, 0);
});
test('HorizontalLayoutRenderer with Children', t => {
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
test('HorizontalLayoutRenderer notify visible', t => {
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
test('HorizontalLayoutRenderer notify disabled', t => {
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
test('HorizontalLayoutRenderer notify enabled', t => {
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
test('HorizontalLayoutRenderer disconnected no notify visible', t => {
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
