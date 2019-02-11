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
import {
  ControlElement,
  getData,
  HorizontalLayout,
  JsonSchema,
  update
} from '@jsonforms/core';
import TextField, { textFieldTester, } from '../../src/fields/TextField';
import HorizontalLayoutRenderer from '../../src/layouts/HorizontalLayout';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';

const defaultMaxLength = 524288;
const defaultSize = 20;

test.beforeEach(t => {
  t.context.data =  { 'name': 'Foo' };
  t.context.minLengthSchema = {
    type: 'string',
    minLength: 3
  };
  t.context.maxLengthSchema = {
    type: 'string',
    maxLength: 5
  };
  t.context.schema = { type: 'string' };
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/name'
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
      firstName: { type: 'string' },
      lastName:  { type: 'string' }
    }
  };
  const firstControlElement: ControlElement = {
    type: 'Control',
    scope:   '#/properties/firstName',
    options: { focus: true }
  };
  const secondControlElement: ControlElement = {
    type: 'Control',
    scope:   '#/properties/lastName',
    options: { focus: true }
  };
  const uischema: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: [firstControlElement, secondControlElement]
  };
  const store = initJsonFormsStore({
    data: { firstName: 'Foo', lastName: 'Boo' },
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
    scope:   '#/properties/name',
    options: { focus: true }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={uischema} path='name' />
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(document.activeElement, input);
});

test('autofocus inactive', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope:   '#/properties/name',
    options: { focus: false }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={uischema} path='name' />
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.not(document.activeElement, input);
});

test('autofocus inactive by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema} path='name' />
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.not(document.activeElement, input);
});

test('tester', t => {
  t.is(textFieldTester(undefined, undefined), -1);
  t.is(textFieldTester(null, undefined), -1);
  t.is(textFieldTester({type: 'Foo'}, undefined), -1);
  t.is(textFieldTester({type: 'Control'}, undefined), -1);
});

test('render', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  };
  const store = initJsonFormsStore({
    data: { name: 'Foo' },
    schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={schema} uischema={t.context.uischema} path='name'/>
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, 'Foo');
});

test('update via input event', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema} path='name'/>
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  input.value = 'Bar';
  TestUtils.Simulate.change(input);
  t.is(getData(store.getState()).name, 'Bar');
});

test.cb('update via action', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema} path='name' />
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('name', () => 'Bar'));
  setTimeout(
    () => {
      t.is(input.value, 'Bar');
      t.end();
    },
    100
  );
});

test('update with undefined value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema} path='name'/>
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('name', () => undefined));
  t.is(input.value, '');
});

test('update with null value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema} path='name'/>
    </Provider>
  ) as React.Component<any>;;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('name', () => null));
  t.is(input.value, '');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema} path='name'/>
    </Provider>
  ) as React.Component<any>;;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('firstname', () => 'Bar'));
  t.is(input.value, 'Foo');
});

test('update with null ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema} path='name'/>
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(null, () => 'Bar'));
  t.is(input.value, 'Foo');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema} path='name'/>
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(undefined, () => 'Bar'));
  t.is(input.value, 'Foo');
});

test('disable', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema} path='name' enabled={false}/>
    </Provider>
  ) as React.Component<any>;;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.true(input.disabled);
});

test('enabled by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema} path='name' />
    </Provider>
  ) as React.Component<any>;;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.disabled);
});

test('use maxLength for attributes size and maxlength', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const config = {
    restrict: true,
    trim: true
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.maxLengthSchema,
    uischema,
    config
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.maxLengthSchema} uischema={uischema} path='name' />
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, 5);
  t.is(input.size, 5);
});

test('use maxLength for attribute size only', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const config = {
    restrict: false,
    trim: true
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.maxLengthSchema,
    uischema,
    config
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.maxLengthSchema} uischema={uischema} path='name' />
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, defaultMaxLength);
  t.is(input.size, 5);
});

test('use maxLength for attribute max length only', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope:   '#/properties/name'
  };
  const config = {
    restrict: true,
    trim: false
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.maxLengthSchema,
    uischema,
    config
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.maxLengthSchema} uischema={uischema} path='name' />
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, 5);
  t.is(input.size, defaultSize);
});

test('do not use maxLength by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.maxLengthSchema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.maxLengthSchema} uischema={t.context.uischema} path='name'/>
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, defaultMaxLength);
  t.is(input.size, defaultSize);
});

test('maxLength not specified, attributes should have default values (trim && restrict)', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const config = {
    restrict: true,
    trim: true
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema,
    config
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema} uischema={uischema} path='name'/>
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, defaultMaxLength);
  t.is(input.size, defaultSize);
});

test('maxLength not specified, attributes should have default values (trim)', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope:   '#/properties/name'
  };
  const config = {
    restrict: false,
    trim: true
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema,
    config
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema} uischema={uischema} path='name' />
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, defaultMaxLength);
  t.is(input.size, defaultSize);
});

test('maxLength not specified, attributes should have default values (restrict)', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope:   '#/properties/name'
  };
  const config = {
    restrict: true,
    trim: false
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema,
    config
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema} uischema={uischema} path='name'/>
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, defaultMaxLength);
  t.is(input.size, defaultSize);
});

test('maxLength not specified, attributes should have default values', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema} uischema={t.context.uischema} path='name' />
    </Provider>
  ) as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, defaultMaxLength);
  t.is(input.size, defaultSize);
});
