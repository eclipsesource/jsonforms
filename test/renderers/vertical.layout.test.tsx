import test from 'ava';
import '../helpers/setup';
import { JsonForms } from '../../src/core';
import {UISchemaElement, VerticalLayout} from '../../src/models/uischema';
import {
  VerticalLayoutRenderer,
  verticalLayoutTester
} from '../../src/renderers/layouts/vertical.layout';
import { findRenderedDOMElementWithClass, renderIntoDocument } from 'inferno-test-utils';

test.before(() => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'vertical-layout',
      classNames: ['vertical-layout']
    }
  ]);
});

test('tester', t => {
  t.is(verticalLayoutTester(undefined, undefined), -1);
  t.is(verticalLayoutTester(null, undefined), -1);
  t.is(verticalLayoutTester({type: 'Foo'}, undefined), -1);
  t.is(verticalLayoutTester({type: 'VerticalLayout'}, undefined), 1);
});

test('render with undefined elements', t => {
  const uischema: UISchemaElement = {
    type: 'VerticalLayout'
  };
  const tree = renderIntoDocument(
    <VerticalLayoutRenderer uischema={uischema} />
  );

  t.not(findRenderedDOMElementWithClass(tree, 'vertical-layout'), undefined);
});

test('render with null elements', t => {
  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: null
  };
  const tree = renderIntoDocument(
    <VerticalLayoutRenderer uischema={uischema} />
  );

  t.not(findRenderedDOMElementWithClass(tree, 'vertical-layout'), undefined);
});

test('render with children', t => {
  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [ {type: 'Control'}, {type: 'Control'} ]
  };
  const tree = renderIntoDocument(
    <VerticalLayoutRenderer uischema={uischema} />
  );
  const verticalLayout = findRenderedDOMElementWithClass(tree, 'vertical-layout');

  t.is(verticalLayout.tagName, 'DIV');
  t.is(verticalLayout.children.length, 2);
});

test('hide', t => {
  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [{ type: 'Control' }],
  };
  const tree = renderIntoDocument(
    <VerticalLayoutRenderer uischema={uischema}
                            visible={false}
    />
  );
  const verticalLayout = findRenderedDOMElementWithClass(tree, 'vertical-layout') as HTMLDivElement;
  t.true(verticalLayout.hidden);
});

test('show by default', t => {
  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [{ type: 'Control' }],
  };
  const tree = renderIntoDocument(
    <VerticalLayoutRenderer uischema={uischema} />
  );
  const verticalLayout = findRenderedDOMElementWithClass(tree, 'vertical-layout') as HTMLDivElement;
  t.false(verticalLayout.hidden);
});

// test('Render disabled VerticalLayout', t => {
//   const renderer: VerticalLayoutRenderer = new VerticalLayoutRenderer();
//   const verticalLayout: VerticalLayout = {
//     type: 'VerticalLayout',
//     elements: [{type: 'Control'}]
//   };
//   renderer.setUiSchema(verticalLayout);
//   renderer.insert();
//   const runtime = verticalLayout.runtime as Runtime;
//   runtime.enabled = false;
//
//   const result = patch(
//     document.createElement('div'),
//     renderer.render()
//   ).elm as HTMLFieldSetElement;
//
//   t.is(result.tagName, 'DIV');
//   t.is(result.className, 'vertical-layout');
//   t.true(result.disabled);
// });
//
// test('Render enabled VerticalLayout', t => {
//   const renderer: VerticalLayoutRenderer = new VerticalLayoutRenderer();
//   const verticalLayout: VerticalLayout = {
//     type: 'VerticalLayout',
//     elements: [{type: 'Control'}],
//     runtime: new Runtime()
//   };
//   renderer.setUiSchema(verticalLayout);
//   renderer.insert();
//   const runtime = verticalLayout.runtime as Runtime;
//   runtime.enabled = true;
//
//   const result = patch(
//     document.createElement('div'),
//     renderer.render()
//   ).elm as HTMLFieldSetElement;
//
//   t.is(result.tagName, 'DIV');
//   t.is(result.className, 'vertical-layout');
//   t.false(result.disabled);
// });
