import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import { initJsonFormsStore } from '../helpers/setup';
import { JsonSchema } from '../../src/models/jsonSchema';
import { ControlElement, HorizontalLayout } from '../../src/models/uischema';
import TextField , { textFieldTester } from '../../src/renderers/fields/text.field';
import { HorizontalLayoutRenderer } from '../../src/renderers/layouts/horizontal.layout';
import { JsonForms } from '../../src/core';
import { update, validate } from '../../src/actions';
import { getData } from '../../src/reducers/index';
import {
  change,
  findRenderedDOMElementWithClass,
  findRenderedDOMElementWithTag,
  renderIntoDocument,
  scryRenderedDOMElementsWithClass,
  scryRenderedDOMElementsWithTag
} from '../helpers/binding';
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
  t.context.data =  { 'name': 'Foo' };
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
// TODO: I don't understand this test
test.skip('autofocus on first element', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' }
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
            <HorizontalLayoutRenderer schema={schema}
                                      uischema={uischema}
            />
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
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextField schema={t.context.schema}
                         uischema={uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
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
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextField schema={t.context.schema}
                         uischema={uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.not(document.activeElement, input);
});

test('autofocus inactive by default', t => {
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/name'
        }
    };
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextField schema={t.context.schema}
                         uischema={uischema}
            />
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
  const data = { 'name': 'Foo' };
  const store = initJsonFormsStore(data, schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, 'Foo');
});

test('update via input event', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = 'Bar';
  change(input);
  t.is(getData(store.getState()).name, 'Bar');
});

test('update via action', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('name', () => 'Bar'));
  setTimeout(() => t.is(input.value, 'Bar'), 100);
});

test('update with undefined value', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('name', () => undefined));
  t.is(input.value, '');
});

test('update with null value', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('name', () => null));
  t.is(input.value, '');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(
    update(
      'firstname',
      () => 'Bar'
    )
  );
  t.is(input.value, 'Foo');
});

test('update with null ref', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(
    update(
      null,
      () => 'Bar'
    )
  );
  t.is(input.value, 'Foo');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(
    update(
      undefined,
      () => 'Bar'
    )
  );
  t.is(input.value, 'Foo');
});

test('hide', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema}
                   uischema={t.context.uischema}
                   visible={false}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.true(input.hidden);
});

test('show by default', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.hidden);
});

test('disable', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema}
                   uischema={t.context.uischema}
                   enabled={false}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.true(input.disabled);
});

test('enabled by default', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TextField schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.disabled);
});
