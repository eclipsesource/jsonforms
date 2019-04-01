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
import {
  LabelElement,
  UISchemaElement
} from '@jsonforms/core';
import { Provider } from 'react-redux';
import LabelRenderer, { labelRendererTester } from '../../src/complex/LabelRenderer';
import * as TestUtils from 'react-dom/test-utils';
import { initJsonFormsVanillaStore } from '../vanillaStore';

test.beforeEach(t => {
  t.context.data =  {'name': 'Foo'};
  t.context.schema = {type: 'object', properties: {name: {type: 'string'}}};
  t.context.uischema = {type: 'Label', text: 'Bar'};
  t.context.styles = [
    {
      name: 'label-control',
      classNames: ['jsf-label']
    }
  ];
});

test('tester', t => {
  t.is(labelRendererTester(undefined, undefined), -1);
  t.is(labelRendererTester(null, undefined), -1);
  t.is(labelRendererTester({type: 'Foo'}, undefined), -1);
  t.is(labelRendererTester({type: 'Label'}, undefined), 1);
});

test('render with undefined text', t => {
  const uischema: UISchemaElement = { type: 'Label' };
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema,
    styles: t.context.styles
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <LabelRenderer
        schema={t.context.schema}
        uischema={uischema}
      />
    </Provider>
  )  as React.Component<any>;;

  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.className, 'jsf-label');
  t.is(label.textContent, '');
});

test('render with null text', t => {
  const uischema: LabelElement = {
    type: 'Label',
    text: null
  };
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema,
    styles: t.context.styles
  });

  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <LabelRenderer
        schema={t.context.schema}
        uischema={uischema}
      />
    </Provider>
  ) as React.Component<any>;;
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.className, 'jsf-label');
  t.is(label.textContent, '');
});

test('render with text', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    styles: t.context.styles
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <LabelRenderer
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  ) as React.Component<any>;;
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.className, 'jsf-label');
  t.is(label.childNodes.length, 1);
  t.is(label.textContent, 'Bar');
});

test('hide', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <LabelRenderer
        schema={t.context.schema}
        uischema={t.context.uischema}
        visible={false}
      />
    </Provider>
  ) as React.Component<any>;;
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.true(label.hidden);
});

test('show by default', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <LabelRenderer
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  ) as React.Component<any>;;
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.false(label.hidden);
});
