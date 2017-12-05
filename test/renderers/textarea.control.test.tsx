import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import { initJsonFormsStore } from '../helpers/setup';
import { JsonForms } from '../../src/core';
import { JsonSchema } from '../../src/models/jsonSchema';
import { HorizontalLayoutRenderer } from '../../src/renderers/layouts/horizontal.layout';
import TextAreaControl, {
  textAreaControlTester,
} from '../../src/renderers/controls/textarea.control';
import { ControlElement, HorizontalLayout } from '../../src/models/uischema';
import { update, validate } from '../../src/actions';
import { getData } from '../../src/reducers/index';
import {
  change,
  findRenderedDOMElementWithClass,
  findRenderedDOMElementWithTag,
  renderIntoDocument
} from '../helpers/test';
import { Provider } from '../../src/common/binding';

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

test('autofocus on first element', t => {
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
    renderIntoDocument(
        <Provider store={store}>
            <HorizontalLayoutRenderer schema={schema}
                                      uischema={uischema}
            />
        </Provider>
    );
    const activeElement = document.activeElement.getElementsByTagName('input')[0].id;
    t.is(activeElement, '#/properties/firstName');
    t.not(activeElement, '#/properties/lastName');
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
            <TextAreaControl schema={t.context.schema}
                             uischema={uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLInputElement;
    t.true(input.autofocus);
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
            <TextAreaControl schema={t.context.schema}
                             uischema={uischema}
            />
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
            <TextAreaControl schema={t.context.schema}
                             uischema={uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLInputElement;
    t.false(input.autofocus);
});

test('tester', t => {
  t.is(textAreaControlTester(undefined, undefined), -1);
  t.is(textAreaControlTester(null, undefined), -1);
  t.is(textAreaControlTester({type: 'Foo'}, undefined), -1);
  t.is(textAreaControlTester({type: 'Control'}, undefined), -1);
  t.is(textAreaControlTester({type: 'Control', options: {multi: true}}, undefined), 2);
});

test('render', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <TextAreaControl store={store}
                     dataSchema={t.context.schema}
                     uischema={t.context.uischema}
    />
  );

  const control = findRenderedDOMElementWithClass(tree, 'control');
  t.not(findRenderedDOMElementWithClass(tree, 'root_properties_name'), undefined);
  t.is(control.childNodes.length, 3);

  const label = findRenderedDOMElementWithTag(tree, 'label');
  t.is(label.textContent, 'Name');

  const textarea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  t.is(textarea.value, 'Foo');

  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('render without label', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/name'
    },
    label: false
  };
  const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaControl schema={t.context.schema}
                       uischema={uischema}
      />
    </Provider>
  );

  const control = findRenderedDOMElementWithClass(tree, 'control');
  t.not(control, undefined);
  t.is(control.childNodes.length, 3);

  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, '');

  const textarea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLInputElement;
  t.is(textarea.value, 'Foo');

  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('update via input event', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaControl schema={t.context.schema}
                       uischema={t.context.uischema}
      />
    </Provider>
  );

  const textarea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  textarea.value = 'Bar';
  change(textarea);
  t.is(getData(store.getState()).name, 'Bar');
});

test('update via action', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaControl schema={t.context.schema}
                       uischema={t.context.uischema}
      />
    </Provider>
  );
  const textarea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  store.dispatch(update('name', () => 'Bar'));
  setTimeout(() => t.is(textarea.value, 'Bar'), 100);
});

test('update with undefined value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaControl schema={t.context.schema}
                       uischema={t.context.uischema}
      />
    </Provider>
  );
  const textArea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  store.dispatch(update('name', () => undefined));
  // keep value
  t.is(textArea.value, 'Foo');
});

test('update with null value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaControl schema={t.context.schema}
                       uischema={t.context.uischema}
      />
    </Provider>
  );
  const textArea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  store.dispatch(update('name', () => null));
  t.is(textArea.value, 'Foo');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaControl schema={t.context.schema}
                       uischema={t.context.uischema}
      />
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
      <TextAreaControl schema={t.context.schema}
                       uischema={t.context.uischema}
      />
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
      <TextAreaControl schema={t.context.schema}
                       uischema={t.context.uischema}
      />
    </Provider>
  );
  const textArea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  store.dispatch(update(undefined, () => 'Bar'));
  t.is(textArea.value, 'Foo');
});

test('hide', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaControl schema={t.context.schema}
                       uischema={t.context.uischema}
                       visible={false}
      />
    </Provider>
  );
  const textArea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  t.true(textArea.hidden);
});

test('show by default', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaControl schema={t.context.schema}
                       uischema={t.context.uischema}
      />
    </Provider>
  );
  const textArea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  t.false(textArea.hidden);
});

test('disable', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaControl schema={t.context.schema}
                       uischema={t.context.uischema}
                       enabled={false}
      />
    </Provider>
  );
  const textArea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  t.true(textArea.disabled);
});

test('enabled by default', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaControl schema={t.context.schema}
                       uischema={t.context.uischema}
      />
    </Provider>
  );
  const textArea = findRenderedDOMElementWithTag(tree, 'textarea') as HTMLTextAreaElement;
  t.false(textArea.disabled);
});

test('single error', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaControl schema={t.context.schema}
                       uischema={t.context.uischema}
      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('name', () => 'a'));
  store.dispatch(validate());
  t.is(validation.textContent, 'should NOT be shorter than 3 characters');
});

test('multiple errors', t => {
  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        enum: ['foo', 'bar']
      }
    }
  };
  const store = initJsonFormsStore(t.context.data, schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaControl schema={t.context.schema}
                       uischema={t.context.uischema}
      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('name', () => 'a'));
  store.dispatch(validate());
  t.is(
    validation.textContent,
    'should NOT be shorter than 3 characters\nshould be equal to one of the allowed values'
  );
});

test('empty errors by default', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaControl schema={t.context.schema}
                       uischema={t.context.uischema}

      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  t.is(validation.textContent, '');
});

test('reset validation message', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextAreaControl schema={t.context.schema}
                       uischema={t.context.uischema}

      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('name', () => 'a'));
  store.dispatch(update('name', () => 'aaa'));
  store.dispatch(validate());
  t.is(validation.textContent, '');
});

test('required field with warning', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            textField: {
                type: 'string',
                minLength: 3
            }
        },
        required: ['textField']
    };
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/textField'
        }
    };

    const store = initJsonFormsStore(
        {},
        schema,
        uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
          <TextAreaControl schema={schema}
                           uischema={uischema}
          />
        </Provider>
    );
    const label = findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, 'Text Field*');
});

test('not required', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            textField: {
                type: 'string',
                minLength: 3
            }
        }
    };
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/textField'
        }
    };

    const store = initJsonFormsStore(
        {},
        schema,
        uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
          <TextAreaControl schema={schema}
                           uischema={uischema}
          />
        </Provider>
    );
    const label = findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, 'Text Field');
});
