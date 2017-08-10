import test from 'ava';
import '../helpers/setup';
import { HorizontalLayout, UISchemaElement } from '../../src/models/uischema';
import { JsonForms } from '../../src/core';
import {
  HorizontalLayoutRenderer,
  horizontalLayoutTester
} from '../../src/renderers/layouts/horizontal.layout';
import { findRenderedDOMElementWithClass, renderIntoDocument } from 'inferno-test-utils';

test.before(() => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'horizontal-layout',
      classNames: ['horizontal-layout']
    }
  ]);
});
test.beforeEach(t => {
  t.context.uischema = {
    type: 'HorizontalLayout',
    elements: [{type: 'Control'}]
  };
});

test('tester', t => {
  t.is(horizontalLayoutTester(undefined, undefined), -1);
  t.is(horizontalLayoutTester(null, undefined), -1);
  t.is(horizontalLayoutTester({ type: 'Foo' }, undefined), -1);
  t.is(horizontalLayoutTester({ type: 'HorizontalLayout' }, undefined), 1);
});

test('render with undefined elements', t => {
  const uischema: UISchemaElement = {
    type: 'HorizontalLayout'
  };
  const tree = renderIntoDocument(
    <HorizontalLayoutRenderer uischema={uischema} />
  );

  const horizontalLayout = findRenderedDOMElementWithClass(tree, 'horizontal-layout');
  t.not(horizontalLayout, undefined);
  t.is(horizontalLayout.children.length, 0);
});

test('render with null elements', t => {
  const uischema: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: null
  };
  const tree = renderIntoDocument(<HorizontalLayoutRenderer uischema={uischema} />);
  const horizontalLayout = findRenderedDOMElementWithClass(tree, 'horizontal-layout');
  t.not(horizontalLayout, undefined);
  t.is(horizontalLayout.children.length, 0);
});

test('render with children', t => {
  const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
  const uischema: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: [
      { type: 'Control' },
      { type: 'Control' }
    ]
  };
  const tree = renderIntoDocument(<HorizontalLayoutRenderer uischema={uischema} />);
  const horizontalLayout = findRenderedDOMElementWithClass(tree, 'horizontal-layout');
  t.not(horizontalLayout, undefined);
  t.is(horizontalLayout.children.length, 2);
});

test('hide', t => {
  const tree = renderIntoDocument(
    <HorizontalLayoutRenderer uischema={t.context.uischema}
                              visible={false}
    />
  );
  const horizontalLayout = findRenderedDOMElementWithClass(
    tree, 'horizontal-layout'
  ) as HTMLDivElement;
  t.true(horizontalLayout.hidden);
});

test('show by default', t => {
  const tree = renderIntoDocument(<HorizontalLayoutRenderer uischema={t.context.uischema}/>);
  const horizontalLayout = findRenderedDOMElementWithClass(
    tree, 'horizontal-layout'
  ) as HTMLDivElement;
  console.log(horizontalLayout.outerHTML);
  t.false(horizontalLayout.hidden);
});

// test('Disable HorizontalLayout', t => {
//   const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
//   renderer.setUiSchema(t.context.uischema);
//   renderer.insert();
//   const runtime = t.context.uischema.runtime;
//   runtime.enabled = false;
//   const div = patchAndGetElement<HTMLDivElement>(renderer.render());
//   t.is(div.tagName, 'DIV');
//   t.is(div.className, 'horizontal-layout');
//   // TODO: we should rather check wheter a child is disabled
//   // t.true(div.disabled);
// });
//
// test('Enable HorizontalLayout', t => {
//   const renderer: HorizontalLayoutRenderer = new HorizontalLayoutRenderer();
//   renderer.setUiSchema(t.context.uischema);
//   renderer.insert();
//   const runtime = t.context.uischema.runtime;
//   runtime.enabled = true;
//   const div = patchAndGetElement<HTMLDivElement>(renderer.render());
//   t.is(div.tagName, 'DIV');
//   t.is(div.className, 'horizontal-layout');
//   // t.false(div.disabled);
// });
