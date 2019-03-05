/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
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
import * as React from 'react';
import { Provider } from 'react-redux';
import test from 'ava';
import { UISchemaElement, VerticalLayout } from '@jsonforms/core';
import VerticalLayoutRenderer, { verticalLayoutTester } from '../../src/layouts/VerticalLayout';
import * as TestUtils from 'react-dom/test-utils';
import { initJsonFormsVanillaStore } from '../vanillaStore';

const styles = [
  {
    name: 'vertical.layout',
    classNames: ['vertical-layout']
  }
];

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
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: {},
    uischema,
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <VerticalLayoutRenderer uischema={uischema} />
    </Provider>
  ) as React.Component<any>;

  t.not(TestUtils.findRenderedDOMComponentWithClass(tree, 'vertical-layout'), undefined);
});

test('render with null elements', t => {
  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: null
  };
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: {},
    uischema,
    styles
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <VerticalLayoutRenderer uischema={uischema} />
    </Provider>
  ) as React.Component<any>;

  t.not(TestUtils.findRenderedDOMComponentWithClass(tree, 'vertical-layout'), undefined);
});

test('render with children', t => {
  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [ {type: 'Control'}, {type: 'Control'} ]
  };
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: {},
    uischema,
    styles
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <VerticalLayoutRenderer uischema={uischema} />
    </Provider>
  ) as React.Component<any>;
  const verticalLayout = TestUtils.findRenderedDOMComponentWithClass(tree, 'vertical-layout');

  t.is(verticalLayout.tagName, 'DIV');
  t.is(verticalLayout.children.length, 2);
});

test('hide', t => {
  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [{ type: 'Control' }],
  };
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: {},
    uischema,
    styles
  });

  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <VerticalLayoutRenderer
        uischema={uischema}
        visible={false}
      />
    </Provider>
  ) as React.Component<any>;
  const verticalLayout = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'vertical-layout'
  ) as HTMLDivElement;
  t.true(verticalLayout.hidden);
});

test('show by default', t => {
  const uischema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: [{ type: 'Control' }],
  };
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: {},
    uischema,
    styles,
  });

  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <VerticalLayoutRenderer uischema={uischema} />
    </Provider>
  ) as React.Component<any>;
  const verticalLayout = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'vertical-layout'
  ) as HTMLDivElement;
  t.false(verticalLayout.hidden);
});
