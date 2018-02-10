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
import TextField, { materialTextFieldTester, } from '../../src/fields/MaterialTextField';
import HorizontalLayoutRenderer from '../../src/layouts/MaterialHorizontalLayout';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';

const DEFAULT_MAX_LENGTH = 524288;

test.beforeEach(t => {
  t.context.data =  { 'name': 'Foo' };
  t.context.minLengthSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3
      }
    }
  };
  t.context.maxLengthSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        maxLength: 5
      }
    }
  };
  t.context.schema = {
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  };
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/name'
  };
});
test.failing('autofocus on first element', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' }
    }
  };
  const firstControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/firstName',
    options: { focus: true }
  };
  const secondControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/lastName',
    options: {
      focus: true
    }
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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer schema={schema} uischema={uischema}/>
    </Provider>
  );
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
  t.not(document.activeElement, inputs[0]);
  t.is(document.activeElement, inputs[1]);
});

test('autofocus active', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name',
    options: { focus: true }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(document.activeElement, input);
});

test('autofocus inactive', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name',
    options: { focus: false }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.not(document.activeElement, input);
});

test('autofocus inactive by default', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.not(document.activeElement, input);
});

test('tester', t => {
  t.is(materialTextFieldTester(undefined, undefined), -1);
  t.is(materialTextFieldTester(null, undefined), -1);
  t.is(materialTextFieldTester({type: 'Foo'}, undefined), -1);
  // scope is missing
  t.is(materialTextFieldTester({type: 'Control'}, undefined), -1);
});

test('render', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  };
  const store = initJsonFormsStore({
    data: { 'name': 'Foo' },
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, 'Foo');
});

test('update via input event', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );

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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );
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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );
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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );
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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );
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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );
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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );
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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema} enabled={false}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.true(input.disabled);
});

test('enabled by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.disabled);
});

test('use maxLength for attributes size and maxlength', t => {
  const uischema = {
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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.maxLengthSchema} uischema={uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, 5);
  t.not(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'), '100%');
});

test('use maxLength for attribute size only', t => {
  const uischema = {
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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.maxLengthSchema} uischema={uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, DEFAULT_MAX_LENGTH);
  t.not(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'), '100%');
});

test('use maxLength for attribute maxlength only', t => {
  const uischema = {
    type: 'Control',
    scope: '#/properties/name'
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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.maxLengthSchema} uischema={uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, 5);
  t.is(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'), '100%');
});

test('do not use maxLength by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.maxLengthSchema,
    uischema: t.context.uischema,
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.maxLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, 524288);
  t.is(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'), '100%');
});

test('maxLength not specified, attributes should have default values (trim && restrict)', t => {
  const uischema = {
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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema} uischema={uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, DEFAULT_MAX_LENGTH);
  t.is(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'), '100%');
});

test('maxLength not specified, attributes should have default values (trim)', t => {
  const uischema = {
    type: 'Control',
    scope: '#/properties/name'
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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema} uischema={uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, DEFAULT_MAX_LENGTH);
  t.is(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'), '100%');
});

test('maxLength not specified, attributes should have default values (restrict)', t => {
  const uischema = {
    type: 'Control',
    scope: '#/properties/name'
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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema} uischema={uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, DEFAULT_MAX_LENGTH);
  t.is(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'), '100%');
});

test('if maxLength is not specified, attributes should have default values', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, DEFAULT_MAX_LENGTH);
  t.is(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'), '100%');
});
