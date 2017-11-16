import test from 'ava';
import { JSX } from '../../src/renderers/JSX';
import { initJsonFormsStore } from '../helpers/setup';
import { JsonForms } from '../../src/core';
import { UISchemaElement, VerticalLayout } from '../../src/models/uischema';
import VerticalLayoutRenderer, {
  verticalLayoutTester
} from '../../src/renderers/layouts/vertical.layout';
import { findRenderedDOMElementWithClass, renderIntoDocument } from '../helpers/test';
import { Provider } from '../../src/common/binding';

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
  const store = initJsonFormsStore({}, {}, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <VerticalLayoutRenderer uischema={uischema} />
    </Provider>
  );

  t.not(findRenderedDOMElementWithClass(tree, 'vertical-layout'), undefined);
});

test('render with null elements', t => {
  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: null
  };
  const store = initJsonFormsStore({}, {}, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <VerticalLayoutRenderer uischema={uischema} />
    </Provider>
  );

  t.not(findRenderedDOMElementWithClass(tree, 'vertical-layout'), undefined);
});

test('render with children', t => {
  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [ {type: 'Control'}, {type: 'Control'} ]
  };
  const store = initJsonFormsStore({}, {}, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <VerticalLayoutRenderer uischema={uischema} />
    </Provider>
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
  const store = initJsonFormsStore({}, {}, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <VerticalLayoutRenderer uischema={uischema}
                              visible={false}
      />
    </Provider>
  );
  const verticalLayout = findRenderedDOMElementWithClass(tree, 'vertical-layout') as HTMLDivElement;
  t.true(verticalLayout.hidden);
});

test('show by default', t => {
  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [{ type: 'Control' }],
  };
  const store = initJsonFormsStore({}, {}, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <VerticalLayoutRenderer uischema={uischema} />
    </Provider>
  );
  const verticalLayout = findRenderedDOMElementWithClass(tree, 'vertical-layout') as HTMLDivElement;
  t.false(verticalLayout.hidden);
});
