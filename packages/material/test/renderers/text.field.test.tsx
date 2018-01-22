import '../../../test/helpers/setup';
import * as React from 'react';
import test from 'ava';
import {
  ControlElement,
  getData,
  HorizontalLayout,
  initJsonFormsStore,
  JsonSchema,
  update
} from '@jsonforms/core';
import TextField, { textFieldTester, } from '../../src/fields/material-text.field';
import HorizontalLayoutRenderer from '../../src/layouts/MaterialHorizontalLayout';
import {
  change,
  findRenderedDOMElementWithTag,
  renderIntoDocument,
  scryRenderedDOMElementsWithTag
} from '../../../test/helpers/binding';
import { Provider } from 'react-redux';

const defaultMaxLength = 524288;

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
    scope: {
      $ref: '#/properties/name'
    }
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
    scope: { $ref: '#/properties/firstName' },
    options: { focus: true }
  };
  const secondControlElement: ControlElement = {
    type: 'Control',
    scope: { $ref: '#/properties/lastName' },
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
  const tree = renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer schema={schema} uischema={uischema}/>
    </Provider>
  );
  const inputs = scryRenderedDOMElementsWithTag(tree, 'input');
  t.not(document.activeElement, inputs[0]);
  t.is(document.activeElement, inputs[1]);
});

test('autofocus active', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: { $ref: '#/properties/name' },
    options: { focus: true }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(document.activeElement, input);
});

test('autofocus inactive', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: { $ref: '#/properties/name' },
    options: { focus: false }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.not(document.activeElement, input);
});

test('autofocus inactive by default', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: { $ref: '#/properties/name' }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.not(document.activeElement, input);
});

test('tester', t => {
  t.is(textFieldTester(undefined, undefined), -1);
  t.is(textFieldTester(null, undefined), -1);
  t.is(textFieldTester({type: 'Foo'}, undefined), -1);
  // scope is missing
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
    data: { 'name': 'Foo' },
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, 'Foo');
});

test('update via input event', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = 'Bar';
  change(input);
  t.is(getData(store.getState()).name, 'Bar');
});

test.cb('update via action', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
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
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('name', () => undefined));
  t.is(input.value, '');
});

test('update with null value', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('name', () => null));
  t.is(input.value, '');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('firstname', () => 'Bar'));
  t.is(input.value, 'Foo');
});

test('update with null ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(null, () => 'Bar'));
  t.is(input.value, 'Foo');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(undefined, () => 'Bar'));
  t.is(input.value, 'Foo');
});

test('disable', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema} enabled={false}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.true(input.disabled);
});

test('enabled by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.minLengthSchema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.minLengthSchema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.disabled);
});

test('use maxLength for attributes size and maxlength', t => {
  const uischema = {
    type: 'Control',
    scope: { $ref: '#/properties/name' },
    options: {
      trim: true,
      restrict: true
    }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.maxLengthSchema,
    uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.maxLengthSchema} uischema={uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, 5);
  t.not(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'), '100%');
});

test('use maxLength for attribute size only', t => {
  const uischema = {
    type: 'Control',
    scope: { $ref: '#/properties/name' },
    options: { trim: true }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.maxLengthSchema,
    uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.maxLengthSchema} uischema={uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, defaultMaxLength);
  t.not(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'), '100%');
});

test('use maxLength for attribute maxlength only', t => {
  const uischema = {
    type: 'Control',
    scope: { $ref: '#/properties/name' },
    options: { restrict: true }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.maxLengthSchema,
    uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.maxLengthSchema} uischema={uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, 5);
  t.is(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'), '100%');
});

test('do not use maxLength', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.maxLengthSchema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, defaultMaxLength);
  t.is(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'), '100%');
});

test('maxLength not specified, attributes should have default values (trim && restrict)', t => {
  const uischema = {
    type: 'Control',
    scope: { $ref: '#/properties/name' },
    options: {
      trim: true,
      restrict: true
    }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema} uischema={uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, defaultMaxLength);
  t.is(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'), '100%');
});

test('maxLength not specified, attributes should have default values (trim)', t => {
  const uischema = {
    type: 'Control',
    scope: { $ref: '#/properties/name' },
    options: { trim: true }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema} uischema={uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, defaultMaxLength);
  t.is(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'), '100%');
});

test('maxLength not specified, attributes should have default values (restrict)', t => {
  const uischema = {
    type: 'Control',
    scope: { $ref: '#/properties/name' },
    options: { restrict: true }
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema} uischema={uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, defaultMaxLength);
  t.is(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'), '100%');
});

test('if maxLength is not specified, attributes should have default values', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.maxLength, defaultMaxLength);
  t.is(window.getComputedStyle(input.parentElement, null).getPropertyValue('width'), '100%');
});
