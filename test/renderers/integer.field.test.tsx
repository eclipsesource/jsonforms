import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import IntegerField, { integerFieldTester } from '../../src/renderers/fields/integer.field';
import { JsonForms } from '../../src/core';
import { JsonSchema } from '../../src/models/jsonSchema';
import { initJsonFormsStore } from '../helpers/setup';
import { ControlElement, HorizontalLayout } from '../../src/models/uischema';
import { update, validate } from '../../src/actions';
import { getData } from '../../src/reducers/index';
import {
  change,
  findRenderedDOMElementWithClass,
  findRenderedDOMElementWithTag,
  renderIntoDocument,
  scryRenderedDOMElementsWithTag
} from '../helpers/binding';
import { Provider } from '../../src/common/binding';
import { HorizontalLayoutRenderer } from '../../src/renderers/layouts/horizontal.layout';

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
  t.context.data = {'foo': 42};
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'integer',
        minimum: 5
      },
    },
  };
  t.context.uischema = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo',
    },
  };
});
test('autofocus on first element', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            firstIntegerField: { type: 'integer', minimum: 5 },
            secondIntegerField: { type: 'integer', minimum: 5 }
        }
    };
    const firstControlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/firstIntegerField'
        },
        options: {
            focus: true
        }
    };
    const secondControlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/secondIntegerField'
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
        'firstIntegerField': 10,
        'secondIntegerField': 12
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
            $ref: '#/properties/foo'
        },
        options: {
            focus: true
        }
    };
    const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
          <IntegerField schema={t.context.schema} uischema={uischema}/>
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.is(document.activeElement, input);
});

test('autofocus inactive', t => {
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        options: {
            focus: false
        }
    };
    const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
          <IntegerField schema={t.context.schema} uischema={uischema}/>
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.false(input.autofocus);
});

test('autofocus inactive by default', t => {
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
          <IntegerField schema={t.context.schema} uischema={uischema}/>
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.false(input.autofocus);
});

test('tester', t => {
  t.is(integerFieldTester(undefined, undefined), -1);
  t.is(integerFieldTester(null, undefined), -1);
  t.is(integerFieldTester({type: 'Foo'}, undefined), -1);
  t.is(integerFieldTester({type: 'Control'}, undefined), -1);

  const controlElement: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
    integerFieldTester(
      controlElement,
      {type: 'object', properties: {foo: {type: 'string'}}}
    ),
    -1
  );
  t.is(
    integerFieldTester(
      controlElement,
      {type: 'object', properties: {foo: {type: 'string'}, bar: {type: 'integer'}}}
    ),
    -1
  );
  t.is(
    integerFieldTester(
      controlElement,
      {type: 'object', properties: {foo: {type: 'integer'}}}),
    2
  );
});

test('render', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <IntegerField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.type, 'number');
  t.is(input.step, '1');
  t.is(input.value, '42');
});

test('update via input event', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <IntegerField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = '13';
  change(input);
  t.is(getData(store.getState()).foo, 13);
});

test('update via action', t => {
  const data = { 'foo': 13 };
  const store = initJsonFormsStore(data,  t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <IntegerField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => 42));
  setTimeout(() => t.is(input.value, '42'), 100);
});

test('update with undefined value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <IntegerField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => undefined));
  t.is(input.value, '');
});

test('update with null value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <IntegerField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;

  store.dispatch(update('foo', () => null));
  t.is(input.value, '');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <IntegerField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('bar', () => 11));
  t.is(input.value, '42');
});

test('update with null ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <IntegerField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(null, () => 13));
  t.is(input.value, '42');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <IntegerField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  store.dispatch(update(undefined, () => 13));
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, '42');
});

test('disable', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <IntegerField schema={t.context.schema} uischema={t.context.uischema} enabled={false}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.true(input.disabled);
});

test('enabled by default', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <IntegerField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.disabled);
});
