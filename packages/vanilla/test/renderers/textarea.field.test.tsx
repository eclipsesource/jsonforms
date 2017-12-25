import '../helpers/setup';
import * as React from 'react';
import test from 'ava';
import {
  ControlElement,
  getData,
  HorizontalLayout,
  initJsonFormsStore,
  JsonForms,
  JsonSchema,
  update
} from '@jsonforms/core';
import TextAreaField, { textAreaFieldTester, } from '../../src/fields/textarea.field';
import HorizontalLayoutRenderer from '../../src/layouts/horizontal.layout';
import {
  change,
  findRenderedDOMElementWithTag,
  renderIntoDocument,
  scryRenderedDOMElementsWithTag
} from '../helpers/binding';
import { Provider } from 'react-redux';

test.before(() => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'control',
      classNames: ['control']
    },
    {
      name: 'control.validation',
      classNames: ['validation']
    }
  ]);
});

test.beforeEach(t => {
  t.context.data = {'name': 'Foo'};
  t.context.schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3
      }
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
            firstName: { type: 'string', minLength: 3 },
            lastName: { type: 'string', minLength: 3 }
        }
    };
    const firstControlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/firstName'
        },
        options: {
            focus: true
        }
    };
    const secondControlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/lastName'
        },
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
        'firstName': 'Foo',
        'lastName': 'Boo'
    };
    const store = initJsonFormsStore(
        data,
        schema,
        uischema
    );
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
        scope: {
            $ref: '#/properties/name'
        },
        options: {
            focus: true
        }
    };
    const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
          <TextAreaField schema={t.context.schema} uischema={uischema}/>
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLInputElement;
    t.is(document.activeElement, input);
});

test('autofocus inactive', t => {
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/name'
        },
        options: {
            focus: false
        }
    };
    const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
          <TextAreaField schema={t.context.schema} uischema={uischema}/>
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLInputElement;
    t.false(input.autofocus);
});

test('autofocus inactive by default', t => {
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/name'
        }
    };
    const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
          <TextAreaField schema={t.context.schema} uischema={uischema}/>
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLInputElement;
    t.false(input.autofocus);
});

test('tester', t => {
  t.is(textAreaFieldTester(undefined, undefined), -1);
  t.is(textAreaFieldTester(null, undefined), -1);
  t.is(textAreaFieldTester({type: 'Foo'}, undefined), -1);
  t.is(textAreaFieldTester({type: 'Control'}, undefined), -1);
  t.is(textAreaFieldTester({type: 'Control', options: {multi: true}}, undefined), 2);
});

test('render', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <TextAreaField store={store} dataSchema={t.context.schema} uischema={t.context.uischema}/>
  );
  const textarea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  t.is(textarea.value, 'Foo');
});

test('update via input event', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const textarea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  textarea.value = 'Bar';
  change(textarea);
  t.is(getData(store.getState()).name, 'Bar');
});

test.cb('update via action', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const textarea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  store.dispatch(update('name', () => 'Bar'));
  setTimeout(() => {
    t.is(textarea.value, 'Bar');
    t.end()
  }, 100);
});

test('update with undefined value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const textArea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  store.dispatch(update('name', () => undefined));
  t.is(textArea.value, '');
});

test('update with null value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const textArea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  store.dispatch(update('name', () => null));
  t.is(textArea.value, '');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const textArea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  store.dispatch(update('firstname', () => 'Bar'));
  t.is(textArea.value, 'Foo');
});

test('update with null ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const textArea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  store.dispatch(update(null, () => 'Bar'));
  t.is(textArea.value, 'Foo');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const textArea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  store.dispatch(update(undefined, () => 'Bar'));
  t.is(textArea.value, 'Foo');
});

test('disable', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaField schema={t.context.schema} uischema={t.context.uischema} enabled={false}/>
    </Provider>
  );
  const textArea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  t.true(textArea.disabled);
});

test('enabled by default', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const textArea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  t.false(textArea.disabled);
});
