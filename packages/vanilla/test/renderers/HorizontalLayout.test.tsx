/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import '@jsonforms/test';
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
} from '../../src/layouts/HorizontalLayout';
import { initJsonFormsVanillaStore } from '../vanillaStore';

test.beforeEach(t => {
  t.context.uischema = {
    type: 'HorizontalLayout',
    elements: [{type: 'Control'}]
  };
  t.context.styles = [
    {
      name: 'horizontal.layout',
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
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: {},
    uischema,
    styles: t.context.styles
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer uischema={uischema} />
    </Provider>
  ) as React.Component<any>;

  const horizontalLayout = TestUtils.findRenderedDOMComponentWithClass(tree, 'horizontal-layout');
  t.not(horizontalLayout, undefined);
  t.is(horizontalLayout.children.length, 0);
});

test('render with null elements', t => {
  const uischema: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: null
  };
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: {},
    uischema,
    styles: t.context.styles
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer uischema={uischema} />
    </Provider>
  ) as React.Component<any>;
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
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: {},
    uischema,
    styles: t.context.styles
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer uischema={uischema} />
    </Provider>
  ) as React.Component<any>;
  const horizontalLayout = TestUtils.findRenderedDOMComponentWithClass(tree, 'horizontal-layout');
  t.not(horizontalLayout, undefined);
  t.is(horizontalLayout.children.length, 2);
});

test('hide', t => {
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: {},
    uischema: t.context.uischema,
    styles: t.context.styles
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer
        uischema={t.context.uischema}
        visible={false}
      />
    </Provider>
  ) as React.Component<any>;
  const horizontalLayout = TestUtils.findRenderedDOMComponentWithClass(
    tree, 'horizontal-layout'
  ) as HTMLDivElement;
  t.true(horizontalLayout.hidden);
});

test('show by default', t => {
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: {},
    uischema: t.context.uischema,
    styles: t.context.styles
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer uischema={t.context.uischema}/>
    </Provider>
  ) as React.Component<any>;
  const horizontalLayout = TestUtils.findRenderedDOMComponentWithClass(
    tree, 'horizontal-layout'
  ) as HTMLDivElement;
  t.false(horizontalLayout.hidden);
});
