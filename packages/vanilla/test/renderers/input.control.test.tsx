import { initJsonFormsStore } from '@jsonforms/test';
import * as React from 'react';
import test from 'ava';
import '../../src/fields';
import {
  ControlElement,
  DispatchRenderer,
  HorizontalLayout,
  JsonSchema,
  update,
  validate
} from '@jsonforms/core';
import { Provider } from 'react-redux';
import '../../src';
import HorizontalLayoutRenderer from '../../src/layouts/horizontal.layout';
import InputControl, { inputControlTester } from '../../src/controls/input.control';
import * as TestUtils from 'react-dom/test-utils';

test.beforeEach(t => {
  t.context.data = { 'foo': true };
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'boolean'
      }
    }
  };
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
    },
    {
      name: 'input-description',
      classNames: ['input-description']
    }
  ];
});

test('autofocus on first element', t => {
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
    scope: 'properties/secondBooleanField',
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
    uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <DispatchRenderer />
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
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <DispatchRenderer />
    </Provider>
  );

  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'control');
  t.not(control, undefined);
  t.is(control.childNodes.length, 3);
  t.not(TestUtils.findRenderedDOMComponentWithClass(tree, 'root_properties_foo'), undefined);

  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, 'Foo');

  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.not(input, undefined);
  t.not(input, null);

  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
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
    uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <DispatchRenderer />
    </Provider>
  );

  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'control');
  t.not(control, undefined);
  t.is(control.childNodes.length, 3);
  t.not(TestUtils.findRenderedDOMComponentWithClass(tree, 'root_properties_foo'), undefined);
  /*t.not(TestUtils.findRenderedDOMComponentWithClass(tree, 'valid'), undefined);*/

  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, '');

  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.not(input, undefined);
  t.not(input, null);

  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('hide', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl
        data={t.context.data}
        schema={t.context.schema}
        uischema={t.context.uischema}
        path={''}
        visible={false}
      />
    </Provider>
  );
  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'control') as HTMLElement;
  t.true(control.hidden);
});

test('show by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'control') as HTMLElement;
  t.false(control.hidden);
});

test('single error', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 2));
  store.dispatch(validate());
  t.is(validation.textContent, 'should be boolean');
});

test('multiple errors', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 3));
  store.dispatch(validate());
  t.is(validation.textContent, 'should be boolean');
});

test('empty errors by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <DispatchRenderer />
    </Provider>
  );
  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  t.is(validation.textContent, '');
});

test('reset validation message', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <DispatchRenderer />
    </Provider>
  );
  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 3));
  store.dispatch(update('foo', () => true));
  store.dispatch(validate());
  t.is(validation.textContent, '');
});

test('validation of nested schema', t => {
  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      personalData: {
        type: 'object',
        properties: {
          middleName: {
            type: 'string'
          },
          lastName: {
            type: 'string'
          }
        },
        required: ['middleName', 'lastName']
      }
    },
    required: ['name']
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
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer schema={schema} uischema={uischema}/>
    </Provider>
  );
  const validation = TestUtils.scryRenderedDOMComponentsWithClass(tree, 'validation');
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
  const store = initJsonFormsStore({ data: {}, schema, uischema });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  );
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label');
  t.is(label.textContent, 'Date Field');
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

  const store = initJsonFormsStore({ data: {}, schema, uischema });
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

  const store = initJsonFormsStore({ data: {}, schema, uischema });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  );
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label');
  t.is(label.textContent, 'Date Field');
});

test('show description on focus', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Enter your first name'
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const data = { isFocused: false };
  const store = initJsonFormsStore({ data, schema, uischema, styles: t.context.styles });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  );
  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'control') as HTMLDivElement;
  TestUtils.Simulate.focus(control);
  const description =
    TestUtils.findRenderedDOMComponentWithClass(tree, 'input-description') as HTMLDivElement;
  t.is(description.textContent, 'Enter your first name');
});

test('hide description when input field is not focused', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Enter your first name'
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const data = { isFocused: false };
  const store = initJsonFormsStore({ data, schema, uischema, styles: t.context.styles });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  );
  const description = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'input-description'
  ) as HTMLDivElement;
  t.is(description.textContent, '');
});

test('hide description on blur', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Enter your first name'
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const data = { isFocused: false };
  const store = initJsonFormsStore({ data, schema, uischema, styles: t.context.styles });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <DispatchRenderer />
    </Provider>
  );
  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'control') as HTMLDivElement;
  TestUtils.Simulate.focus(control);
  const description =
    TestUtils.findRenderedDOMComponentWithClass(tree, 'input-description') as HTMLDivElement;
  t.is(description.textContent, 'Enter your first name');
  TestUtils.Simulate.blur(control);
  const hiddenDescription =
    TestUtils.findRenderedDOMComponentWithClass(tree, 'input-description') as HTMLDivElement;
  t.is(hiddenDescription.textContent, '');
});

test('description undefined', t => {
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
    scope: '#/properties/name'
  };
  const data = { isFocused: false };
  const store = initJsonFormsStore({ data, schema, uischema, styles: t.context.styles });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <DispatchRenderer />
    </Provider>
  );
  const description =
    TestUtils.findRenderedDOMComponentWithClass(tree, 'input-description') as HTMLDivElement;
  t.is(description.textContent, '');
});
