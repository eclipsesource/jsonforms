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
import { initJsonFormsStore } from '@jsonforms/test';
import * as React from 'react';
import test from 'ava';
import {
  ControlElement,
  getData,
  HorizontalLayout,
  JsonSchema,
  update
} from '@jsonforms/core';
import BooleanField, { booleanFieldTester } from '../../src/fields/BooleanField';
import HorizontalLayoutRenderer from '../../src/layouts/HorizontalLayout';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';

test.beforeEach(t => {
  t.context.data = { foo: true };
  t.context.schema = { type: 'boolean' };
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/foo'
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
test.failing('autofocus on first element', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      firstBooleanField: { type: 'boolean' },
      secondBooleanField: { type: 'boolean' }
    }
  };
  const firstControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/firstBooleanField',
    options: {
      focus: true
    }
  };
  const secondControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/secondBooleanField',
    options: {
      focus: true
    }
  };
  const uischema: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: [
      firstControlElement,
      secondControlElement
    ]
  };
  const data = {
    'firstBooleanField': true,
    'secondBooleanField': false
  };
  const store = initJsonFormsStore({
    data,
    schema,
    uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer schema={schema} uischema={uischema}/>
    </Provider>
  ) as React.Component<any>;
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
  t.not(document.activeElement, inputs[0]);
  t.is(document.activeElement, inputs[1]);
});

test('autofocus active', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    options: {
      focus: true
    }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <BooleanField schema={t.context.schema} uischema={uischema} path='foo'/>
    </Provider>
  ) as React.Component<any>;;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(document.activeElement, input);
});

test('autofocus inactive', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    options: {
      focus: false
    }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <BooleanField schema={t.context.schema} uischema={uischema} path='foo'/>
    </Provider>
  ) as React.Component<any>;;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.autofocus);
});

test('autofocus inactive by default', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <BooleanField schema={t.context.schema} uischema={uischema} path='foo'/>
    </Provider>
  ) as React.Component<any>;;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.not(document.activeElement, input);
});

test('tester', t => {
  t.is(booleanFieldTester(undefined, undefined), -1);
  t.is(booleanFieldTester(null, undefined), -1);
  t.is(booleanFieldTester({type: 'Foo'}, undefined), -1);
  t.is(booleanFieldTester({type: 'Control'}, undefined), -1);
});

test('tester with wrong prop type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.is(
    booleanFieldTester(
      control,
      {type: 'object', properties: {foo: {type: 'string'}}}
    ),
    -1
  );
});

test('tester with wrong prop type, but sibling has correct one', t => {
  const control = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.is(
    booleanFieldTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          },
          bar: {
            type: 'boolean'
          }
        }
      }
    ),
    -1
  );
});

test('tester with matching prop type', t => {
  const control = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.is(
    booleanFieldTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'boolean'
          }
        }
      }
    ),
    2);
});

test('render', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <BooleanField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;;

  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.type, 'checkbox');
  t.is(input.checked, true);
});

test('update via input event', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <BooleanField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;;

  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  input.checked = false;
  TestUtils.Simulate.change(input);
  t.is(getData(store.getState()).foo, false);
});

test('update via action', t => {
  const data = { 'foo': false };
  const store = initJsonFormsStore({
    data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <BooleanField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => false));
  t.is(input.checked, false);
  t.is(getData(store.getState()).foo, false);
});

test.failing('update with undefined value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <BooleanField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => undefined));
  t.is(input.value, '');
});

test.failing('update with null value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <BooleanField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => null));
  t.is(input.value, '');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <BooleanField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('bar', () => 11));
  t.is(input.checked, true);
});

test('update with null ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <BooleanField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(null, () => false));
  t.is(input.checked, true);
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <BooleanField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;;
  store.dispatch(update(undefined, () => false));
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.checked, true);
});

test('disable', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <BooleanField schema={t.context.schema} uischema={t.context.uischema} enabled={false}/>
    </Provider>
  ) as React.Component<any>;;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.true(input.disabled);
});

test('enabled by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <BooleanField schema={t.context.schema} uischema={t.context.uischema} path='foo' />
    </Provider>
  ) as React.Component<any>;;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.disabled);
});
