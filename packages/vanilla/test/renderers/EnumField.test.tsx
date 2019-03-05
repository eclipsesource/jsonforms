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
import { initJsonFormsStore } from '@jsonforms/test';
import * as React from 'react';
import test from 'ava';
import { getData, update } from '@jsonforms/core';
import EnumField, { enumFieldTester } from '../../src/fields/EnumField';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';

test.beforeEach(t => {
  t.context.data = { 'foo': 'a' };
  t.context.schema =  {
        type: 'string',
    enum: ['a', 'b'],
  };
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/foo',
  };
  t.context.styles = [
    {
      name: 'control',
      classNames: ['control']
    },
    {
      name: 'control.validation',
      classNames: ['validation']
    }
  ];
});

test('tester', t => {
  t.is(enumFieldTester(undefined, undefined), -1);
  t.is(enumFieldTester(null, undefined), -1);
  t.is(enumFieldTester({type: 'Foo'}, undefined), -1);
  t.is(enumFieldTester({type: 'Control'}, undefined), -1);
});

test('tester with wrong prop type', t => {
  t.is(
    enumFieldTester(
      t.context.uischema,
      { type: 'object', properties: {foo: {type: 'string'}} }
    ),
    -1
  );
});

test('tester with wrong prop type, but sibling has correct one', t => {
  t.is(
      enumFieldTester(
          t.context.uischema,
          {
            'type': 'object',
            'properties': {
              'foo': {
                'type': 'string'
              },
              'bar': {
                'type': 'string',
                'enum': ['a', 'b']
              }
            }
          }
      ),
      -1
  );
});

test('tester with matching string type', t => {
  t.is(
      enumFieldTester(
          t.context.uischema,
          {
            'type': 'object',
            'properties': {
              'foo': {
                'type': 'string',
                'enum': ['a', 'b']
              }
            }
          }
      ),
      2
  );
});

test('tester with matching numeric type', t => {
  // TODO should this be true?
  t.is(
      enumFieldTester(
          t.context.uischema,
          {
            'type': 'object',
            'properties': {
              'foo': {
                'type': 'number',
                'enum': [1, 2]
              }
            }
          }
      ),
      2
  );
});

test('render', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <EnumField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;

  const select = TestUtils.findRenderedDOMComponentWithTag(tree, 'select') as HTMLSelectElement;
  t.is(select.tagName, 'SELECT');
  t.is(select.value, 'a');
  t.is(select.options.length, 3);
  t.is(select.options.item(0).value, '');
  t.is(select.options.item(1).value, 'a');
  t.is(select.options.item(2).value, 'b');
});

test('update via input event', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <EnumField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;

  const select = TestUtils.findRenderedDOMComponentWithTag(tree, 'select') as HTMLSelectElement;
  select.value = 'b';
  TestUtils.Simulate.change(select);
  t.is(getData(store.getState()).foo, 'b');
});

test('update via action', t => {
  const data = { 'foo': 'b' };
  const store = initJsonFormsStore({
    data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <EnumField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;
  const select = TestUtils.findRenderedDOMComponentWithTag(tree, 'select') as HTMLSelectElement;
  store.dispatch(update('foo', () => 'b'));
  t.is(select.value, 'b');
  t.is(select.selectedIndex, 2);
});

test('update with undefined value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <EnumField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;
  const select = TestUtils.findRenderedDOMComponentWithTag(tree, 'select') as HTMLSelectElement;
  store.dispatch(update('foo', () => undefined));
  t.is(select.selectedIndex, 0);
  t.is(select.value, '');
});

test('update with null value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <EnumField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;
  const select = TestUtils.findRenderedDOMComponentWithTag(tree, 'select') as HTMLSelectElement;
  store.dispatch(update('foo', () => null));
  t.is(select.selectedIndex, 0);
  t.is(select.value, '');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <EnumField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;
  const select = TestUtils.findRenderedDOMComponentWithTag(tree, 'select') as HTMLSelectElement;
  store.dispatch(update('bar', () => 'Bar'));
  t.is(select.selectedIndex, 1);
  t.is(select.value, 'a');
});

test('update with null ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <EnumField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;
  const select = TestUtils.findRenderedDOMComponentWithTag(tree, 'select') as HTMLSelectElement;
  store.dispatch(update(null, () => false));
  t.is(select.selectedIndex, 1);
  t.is(select.value, 'a');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <EnumField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;
  const select = TestUtils.findRenderedDOMComponentWithTag(tree, 'select') as HTMLSelectElement;
  store.dispatch(update(undefined, () => false));
  t.is(select.selectedIndex, 1);
  t.is(select.value, 'a');
});

test('disable', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <EnumField schema={t.context.schema} uischema={t.context.uischema} enabled={false}/>
    </Provider>
  ) as React.Component<any>;
  const select = TestUtils.findRenderedDOMComponentWithTag(tree, 'select') as HTMLSelectElement;
  t.true(select.disabled);
});

test('enabled by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <EnumField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;
  const select = TestUtils.findRenderedDOMComponentWithTag(tree, 'select') as HTMLSelectElement;
  t.false(select.disabled);
});
