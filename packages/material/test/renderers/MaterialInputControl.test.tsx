import { initJsonFormsStore } from '@jsonforms/test';
import * as React from 'react';
import test from 'ava';
import '../../src/fields';
import {
  ControlElement,
  HorizontalLayout,
  JsonSchema,
  update,
  validate
} from '@jsonforms/core';
import InputControl, { inputControlTester } from '../../src/controls/MaterialInputControl';
import HorizontalLayoutRenderer from '../../src/layouts/MaterialHorizontalLayout';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';

test.beforeEach(t => {
  t.context.data = { 'foo': 'bar' };
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    }
  };
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/foo'
  };
});

test('autofocus on first element', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      firstStringField: { type: 'string' },
      secondStringField: { type: 'string' }
    }
  };
  const firstControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/firstStringField',
    options: {
      focus: true
    }
  };
  const secondControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/secondStringField',
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
    'firstStringField': true,
    'secondStringField': false
  };
  const store = initJsonFormsStore({
    data,
    schema,
    uischema,
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

test('tester', t => {
  t.is(inputControlTester(undefined, undefined), -1);
  t.is(inputControlTester(null, undefined), -1);
  t.is(inputControlTester({type: 'Foo'}, undefined), -1);
  t.is(inputControlTester({type: 'Control'}, undefined), -1);
  const control: ControlElement = { type: 'Control', scope: '#/properties/foo' };
  t.is(inputControlTester(control, undefined), 1);
});

test('render', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const control = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'div')[0];
  t.not(control, undefined);
  t.is(control.childNodes.length, 3);

  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, 'Foo');

  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.not(input, undefined);
  t.not(input, null);

  const validation = TestUtils.findRenderedDOMComponentWithTag(tree, 'p');
  t.is(validation.tagName, 'P');
  t.not(validation.className.indexOf('MuiFormHelperText-root'), -1);
  t.is((validation as HTMLParagraphElement).children.length, 0);
});

test('render without label', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: false
  };
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={t.context.schema} uischema={uischema}/>
    </Provider>
  );

  const div = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'div')[0];
  t.not(div, undefined);
  t.is(div.childNodes.length, 3);

  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, '');

  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.not(input, undefined);
  t.not(input, null);

  const validation = TestUtils.findRenderedDOMComponentWithTag(tree, 'p');
  t.is(validation.tagName, 'P');
  t.not(validation.className.indexOf('MuiFormHelperText-root'), -1);
  t.is((validation as HTMLParagraphElement).children.length, 0);
});

test('hide', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={t.context.schema} uischema={t.context.uischema} visible={false}/>
    </Provider>
  );
  const control = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'div')[0] as HTMLElement;
  t.is(getComputedStyle(control).display, 'none');
});

test('show by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
  });

  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const control = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'div')[0] as HTMLElement;
  t.false(control.hidden);
});

test('single error', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const validation = TestUtils.findRenderedDOMComponentWithTag(tree, 'p');
  store.dispatch(update('foo', () => 2));
  store.dispatch(validate());
  t.is(validation.textContent, 'should be string');
});

test('multiple errors', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const validation = TestUtils.findRenderedDOMComponentWithTag(tree, 'p');
  store.dispatch(update('foo', () => 3));
  store.dispatch(validate());
  t.is(validation.textContent, 'should be string');
});

test('empty errors by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const validation = TestUtils.findRenderedDOMComponentWithTag(tree, 'p');
  t.is(validation.textContent, '');
});

test('reset validation message', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const validation = TestUtils.findRenderedDOMComponentWithTag(tree, 'p');
  store.dispatch(update('foo', () => 3));
  store.dispatch(update('foo', () => 'bar'));
  store.dispatch(validate());
  t.is(validation.textContent, '');
});

test('validation of nested schema', t => {
  const schema = {
    'type': 'object',
    'properties': {
      'name': {
        'type': 'string'
      },
      'personalData': {
        'type': 'object',
        'properties': {
          'middleName': {
            'type': 'string'
          },
          'lastName': {
            'type': 'string'
          }
        },
        'required': ['middleName', 'lastName']
      }
    },
    'required': ['name']
  };
  const firstControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const secondControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/personalData/properties/middleName'
  };
  const thirdControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/personalData/properties/lastName'
  };
  const uischema: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: [
      firstControlElement,
      secondControlElement,
      thirdControlElement
    ]
  };
  const data = {
    name: 'John Doe',
    personalData: {}
  };
  const store = initJsonFormsStore({
    data,
    schema,
    uischema,
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer schema={schema} uischema={uischema}/>
    </Provider>
  );
  const validation = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'p');
  store.dispatch(validate());
  t.is(validation[0].textContent, '');
  t.is(validation[1].textContent, 'is a required property');
  t.is(validation[2].textContent, 'is a required property');
});
test('required field is marked', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      dateField: {
        type: 'string',
        format: 'date'
      }
    },
    required: ['dateField']
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/dateField'
  };

  const store = initJsonFormsStore({
    data: {},
    schema,
    uischema,
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  );
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label');
  t.is(label.textContent, 'Date Field*');
});

test('not required', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      dateField: {
        type: 'string',
        format: 'date'
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/dateField'
  };

  const store = initJsonFormsStore({
    data: {},
    schema,
    uischema,
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  );
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label');
  t.is(label.textContent, 'Date Field');
});

test('translate description, translation object defined', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: '%description'
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const translations = {
    'en-US': {
      'description': 'Enter your first name'
    }
  };
  const data = { isFocused: false };
  const store = initJsonFormsStore({
      data,
      schema,
      uischema,
      translations
    }
  );
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  );
  const control = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'div')[0] as HTMLElement;
  TestUtils.Simulate.focus(control);
  const description =
    TestUtils.scryRenderedDOMComponentsWithTag(tree, 'p')[0] as HTMLElement;
  t.is(description.textContent, 'Enter your first name');
});

test('translate label, translation object defined', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name',
    label: {
      text: '%name'
    }
  };
  const translations = {
    'en-US': {
      'name': 'Name'
    }
  };
  const store = initJsonFormsStore({
      data: {},
      schema,
      uischema,
      translations
    }
  );
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  );
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, 'Name');
});

test('translate description fails, translation object undefined', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: '%description'
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const data = { isFocused: false };
  const store = initJsonFormsStore({ data, schema, uischema });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  );
  const control = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'div')[0] as HTMLElement;
  TestUtils.Simulate.focus(control);
  const description =
    TestUtils.scryRenderedDOMComponentsWithTag(tree, 'p')[0] as HTMLElement;
  t.is(description.textContent, '%description');
});

test('translate label fails, translation object undefined', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name',
    label: {
      text: '%name'
    }
  };
  const store = initJsonFormsStore({ data: {}, schema, uischema });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  );
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, '%name');
});

test('translate description, translation object and locale defined', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: '%description'
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const translations = {
    'de-DE': {
      'description': 'Geben Sie Ihren Vornamen ein'
    }
  };
  const locale = 'de-DE';
  const data = { isFocused: false };
  const store = initJsonFormsStore({
      data,
      schema,
      uischema,
      translations,
      locale
    }
  );
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  );
  const control = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'div')[0] as HTMLElement;
  TestUtils.Simulate.focus(control);
  const description =
    TestUtils.scryRenderedDOMComponentsWithTag(tree, 'p')[0] as HTMLElement;
  t.is(description.textContent, 'Geben Sie Ihren Vornamen ein');
});

test('translate label, translation object and locale defined', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name',
    label: {
      text: '%name'
    }
  };
  const translations = {
    'de-DE': {
      'name': 'Name'
    }
  };
  const locale = 'de-DE';
  const store = initJsonFormsStore({
      data: {},
      schema,
      uischema,
      translations,
      locale
    }
  );
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  );
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, 'Name');
});
