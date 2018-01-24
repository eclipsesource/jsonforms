import { initJsonFormsStore } from '@jsonforms/test';
import * as TestUtils from 'react-dom/test-utils';
import * as React from 'react';
import test from 'ava';
import {
  HorizontalLayout,
  UISchemaElement
} from '@jsonforms/core';
import { Provider } from 'react-redux';
import HorizontalLayoutRenderer, {
  horizontalLayoutTester
} from '../../src/layouts/horizontal.layout';

test.beforeEach(t => {
  t.context.uischema = {
    type: 'HorizontalLayout',
    elements: [{type: 'Control'}]
  };
  t.context.styles = [
    {
      name: 'horizontal-layout',
      classNames: ['horizontal-layout']
    }
  ];
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
  const store = initJsonFormsStore({
    data: {},
    schema: {},
    uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer uischema={uischema} />
    </Provider>
  );

  const horizontalLayout = TestUtils.findRenderedDOMComponentWithClass(tree, 'horizontal-layout');
  t.not(horizontalLayout, undefined);
  t.is(horizontalLayout.children.length, 0);
});

test('render with null elements', t => {
  const uischema: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: null
  };
  const store = initJsonFormsStore({
    data: {},
    schema: {},
    uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer uischema={uischema} />
    </Provider>
  );
  const horizontalLayout = TestUtils.findRenderedDOMComponentWithClass(tree, 'horizontal-layout');
  t.not(horizontalLayout, undefined);
  t.is(horizontalLayout.children.length, 0);
});

test('render with children', t => {
  const uischema: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: [
      { type: 'Control' },
      { type: 'Control' }
    ]
  };
  const store = initJsonFormsStore({
    data: {},
    schema: {},
    uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer uischema={uischema} />
    </Provider>
  );
  const horizontalLayout = TestUtils.findRenderedDOMComponentWithClass(tree, 'horizontal-layout');
  t.not(horizontalLayout, undefined);
  t.is(horizontalLayout.children.length, 2);
});

test('hide', t => {
  const store = initJsonFormsStore({
    data: {},
    schema: {},
    uischema: t.context.uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer
        uischema={t.context.uischema}
        visible={false}
      />
    </Provider>
  );
  const horizontalLayout = TestUtils.findRenderedDOMComponentWithClass(
    tree, 'horizontal-layout'
  ) as HTMLDivElement;
  t.true(horizontalLayout.hidden);
});

test('show by default', t => {
  const store = initJsonFormsStore({
    data: {},
    schema: {},
    uischema: t.context.uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer uischema={t.context.uischema}/>
    </Provider>
  );
  const horizontalLayout = TestUtils.findRenderedDOMComponentWithClass(
    tree, 'horizontal-layout'
  ) as HTMLDivElement;
  t.false(horizontalLayout.hidden);
});
