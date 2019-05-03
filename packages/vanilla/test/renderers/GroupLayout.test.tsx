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
import * as React from 'react';
import test from 'ava';
import { GroupLayout } from '@jsonforms/core';
import { JsonFormsReduxContext } from '@jsonforms/react';
import { Provider } from 'react-redux';
import GroupLayoutRenderer, { groupTester } from '../../src/layouts/GroupLayout';
import * as TestUtils from 'react-dom/test-utils';
import { initJsonFormsVanillaStore } from '../vanillaStore';

test.beforeEach(t => {
  t.context.uischema = {
    type: 'GroupLayout',
    elements: [{ type: 'Control' }]
  };
  t.context.styles = [
    {
      name: 'group.layout',
      classNames: ['group-layout']
    }
  ];
});

test('tester', t => {
  t.is(groupTester(undefined, undefined), -1);
  t.is(groupTester(null, undefined), -1);
  t.is(groupTester({ type: 'Foo' }, undefined), -1);
  t.is(groupTester({ type: 'Group' }, undefined), 1);
});

test('render with label', t => {
  const uischema: GroupLayout = {
    type: 'Group',
    label: 'Foo',
    elements: [],
  };
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: {},
    uischema,
    styles: t.context.styles
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <GroupLayoutRenderer uischema={uischema} />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const groupLayout = TestUtils.findRenderedDOMComponentWithClass(tree, 'group-layout');
  t.is(groupLayout.tagName, 'FIELDSET');
  t.is(groupLayout.className, 'group-layout');
  t.is(groupLayout.children.length, 1);
  const legend = groupLayout.children[0];
  t.is(legend.tagName, 'LEGEND');
  t.is(legend.textContent, 'Foo');
});

test('render with null elements', t => {
  const uischema: GroupLayout = {
    type: 'Group',
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
      <JsonFormsReduxContext>
        <GroupLayoutRenderer uischema={uischema} />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const groupLayout = TestUtils.findRenderedDOMComponentWithClass(tree, 'group-layout');
  t.is(groupLayout.tagName, 'FIELDSET');
  t.is(groupLayout.children.length, 0);
});

test('render with children', t => {
  const uischema: GroupLayout = {
    type: 'Group',
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
      <JsonFormsReduxContext>
        <GroupLayoutRenderer uischema={uischema} />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const groupLayout = TestUtils.findRenderedDOMComponentWithClass(tree, 'group-layout');
  t.is(groupLayout.tagName, 'FIELDSET');
  t.is(groupLayout.children.length, 2);
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
      <JsonFormsReduxContext>
        <GroupLayoutRenderer
          uischema={t.context.uischema}
          visible={false}
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const groupLayout = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'group-layout'
  ) as HTMLDivElement;
  t.true(groupLayout.hidden);
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
      <JsonFormsReduxContext>
        <GroupLayoutRenderer uischema={t.context.uischema} />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const groupLayout = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'group-layout'
  ) as HTMLDivElement;
  t.false(groupLayout.hidden);
});
