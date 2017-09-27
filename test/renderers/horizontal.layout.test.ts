import test from 'ava';
// setup import must come first
import '../helpers/setup';
/*tslint:disable */
import {HorizontalLayout, UISchemaElement} from '../../src/models/uischema';
/*tslint:enable */
import { JsonForms } from '../../src/core';
import {
  HorizontalLayoutRenderer,
  horizontalLayoutTester
} from '../../src/renderers/layouts/horizontal.layout';
test.before(t => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'horizontal-layout',
      classNames: ['horizontal-layout']
    },
    {
      name: 'horizontal-layout-item',
      classNames: ['horizontal-layout-myitem']
    }
  ]);
});
test.beforeEach(t => {
  t.context.uiSchema = {
    type: 'HorizontalLayout',
    elements: [{type: 'Control'}]
  };
});

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
  const uiSchema: UISchemaElement = {
    type: 'HorizontalLayout'
  };
  renderer.setUiSchema(uiSchema);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'horizontal-layout');
  t.is(div.children.length, 0);
});

test('Render HorizontalLayout with null elements', t => {
  const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
  const horizontalLayout: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: null
  };
  renderer.setUiSchema(horizontalLayout);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'horizontal-layout');
  t.is(div.children.length, 0);
});

test('Render HorizontalLayout with children', t => {
  const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
  const horizontalLayout: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: [
      {type: 'Control'},
      {type: 'Control'}
    ]
  };
  renderer.setUiSchema(horizontalLayout);
  const result = renderer.render();
  t.is(result.childNodes.length, 1);
  const div = result.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'horizontal-layout');
  t.is(div.children.length, 2);
  t.is(div.children[0].className, 'horizontal-layout-myitem');
  t.is(div.children[1].className, 'horizontal-layout-myitem');
});

test('Hide HorizontalLayout', t => {
  const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const runtime = t.context.uiSchema.runtime;
  runtime.visible = false;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'horizontal-layout');
  t.is(renderer.hidden, true);
});

test('Disable HorizontalLayout', t => {
  const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const runtime = t.context.uiSchema.runtime;
  runtime.enabled = false;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'horizontal-layout');
  t.is(div.getAttribute('disabled'), 'true');
});

test('Enable HorizontalLayout', t => {
  const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  const runtime = t.context.uiSchema.runtime;
  runtime.enabled = true;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'horizontal-layout');
  t.false(div.hasAttribute('disabled'));
});

test('HorizontalLayout should not be hidden if disconnected', t => {
  const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
  renderer.setUiSchema(t.context.uiSchema);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = t.context.uiSchema.runtime;
  runtime.visible = false;
  t.is(renderer.childNodes.length, 1);
  const div = renderer.children[0];
  t.is(div.tagName, 'DIV');
  t.is(div.className, 'horizontal-layout');
  t.is(renderer.hidden, false);
});
