import test from 'ava';
import * as installCE from 'document-register-element/pony';
// inject window, document etc.
import 'jsdom-global/register';
declare let global;
installCE(global, 'force');
import { JsonForms } from '../../src/core';
import { Runtime } from '../../src/core/runtime';
import { VerticalLayout } from '../../src/models/uischema';
import {
  VerticalLayoutRenderer,
  verticalLayoutTester,
} from '../../src/renderers/layouts/vertical.layout';
test.before(t => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'vertical-layout',
      classNames: ['vertical-layout']
    },
    {
      name: 'vertical-layout-item',
      classNames: ['vertical-layout-myitem']
    },
  ]);
});
test('VerticalLayout tester', t => {
  t.is(
      verticalLayoutTester(undefined, undefined),
      -1
  );
  t.is(
      verticalLayoutTester(null, undefined),
      -1
  );
  t.is(
      verticalLayoutTester({type: 'Foo'}, undefined),
      -1
  );
  t.is(
      verticalLayoutTester({type: 'VerticalLayout'}, undefined),
      1
  );
});
test('Render VerticalLayout with undefined elements', t => {
  const renderer: VerticalLayoutRenderer = new VerticalLayoutRenderer();
  const uiSchema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: []
  };
  renderer.setUiSchema(uiSchema);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'vertical-layout');
  t.is(div.children.length, 0);
});
test('Render VerticalLayout with null elements', t => {
  const renderer: VerticalLayoutRenderer = new VerticalLayoutRenderer();
  const uiSchema: VerticalLayout = { type: 'VerticalLayout', elements: null };
  renderer.setUiSchema(uiSchema);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'vertical-layout');
  t.is(div.children.length, 0);
});
test('Render VerticalLayout with children', t => {
  const renderer: VerticalLayoutRenderer = new VerticalLayoutRenderer();
  const uiSchema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [ {type: 'Control'}, {type: 'Control'} ]
  };
  renderer.setUiSchema(uiSchema);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'vertical-layout');
  t.is(div.children.length, 2);
  t.is(div.children[0].className, 'vertical-layout-myitem');
  t.is(div.children[1].className, 'vertical-layout-myitem');
});
test('Hide VerticalLayout', t => {
  const renderer: VerticalLayoutRenderer = new VerticalLayoutRenderer();
  const verticalLayout: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [{type: 'Control'}]
  };
  renderer.setUiSchema(verticalLayout);
  renderer.connectedCallback();
  const runtime = verticalLayout.runtime as Runtime;
  runtime.visible = false;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'vertical-layout');
  t.is(renderer.hidden, true);
});
test('Disable VerticalLayout', t => {
  const renderer: VerticalLayoutRenderer = new VerticalLayoutRenderer();
  const verticalLayout: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [{type: 'Control'}]
  };
  renderer.setUiSchema(verticalLayout);
  renderer.connectedCallback();
  const runtime = verticalLayout.runtime as Runtime;
  runtime.enabled = false;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'vertical-layout');
  t.is(div.getAttribute('disabled'), 'true');
});
test('Enable VerticalLayout', t => {
  const renderer: VerticalLayoutRenderer = new VerticalLayoutRenderer();
  const verticalLayout: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [{type: 'Control'}]
  };
  renderer.setUiSchema(verticalLayout);
  renderer.connectedCallback();
  const runtime = verticalLayout.runtime as Runtime;
  runtime.enabled = true;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'vertical-layout');
  t.false(div.hasAttribute('disabled'));
});
test('VerticalLayout should not be hidden if disconnected', t => {
  const renderer: VerticalLayoutRenderer = new VerticalLayoutRenderer();
  const verticalLayout: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [{type: 'Control'}]
  };
  renderer.setUiSchema(verticalLayout);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = verticalLayout.runtime as Runtime;
  runtime.visible = false;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'vertical-layout');
  t.is(renderer.hidden, false);
});
