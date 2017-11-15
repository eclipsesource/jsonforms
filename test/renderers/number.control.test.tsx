import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import { JsonForms } from '../../src/core';
import { initJsonFormsStore } from '../helpers/setup';
import { ControlElement, HorizontalLayout } from '../../src/models/uischema';
import { update, validate } from '../../src/actions';
import NumberControl, { numberControlTester } from '../../src/renderers/controls/number.control';
import { JsonSchema } from '../../src/models/jsonSchema';
import { getData } from '../../src/reducers/index';
import {
  change,
  findRenderedDOMElementWithClass,
  findRenderedDOMElementWithTag,
  renderIntoDocument
} from '../helpers/test';
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
  t.context.data = {'foo': 3.14};
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'number',
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
            firstNumberField: { type: 'number', minimum: 5 },
            secondNumberField: { type: 'number', minimum: 5 }
        }
    };
    const firstControlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/firstNumberField'
        },
        options: {
            focus: true
        }
    };
    const secondControlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/secondNumberField'
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
        'firstNumberField': 3.14,
        'secondNumberField': 5.12
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
    t.is(activeElement, '#/properties/firstNumberField');
    t.not(activeElement, '#/properties/secondNumberField');
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
            <NumberControl schema={t.context.schema}
                           uischema={uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.true(input.autofocus);
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
            <NumberControl schema={t.context.schema}
                           uischema={uischema}
            />
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
            <NumberControl schema={t.context.schema}
                           uischema={uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.false(input.autofocus);
});

test('tester', t => {
  t.is(numberControlTester(undefined, undefined), -1);
  t.is(numberControlTester(null, undefined), -1);
  t.is(numberControlTester({type: 'Foo'}, undefined), -1);
  t.is(numberControlTester({type: 'Control'}, undefined), -1);
});

test('tester with wrong schema type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
      numberControlTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'string'
              }
            }
          }
      ),
      -1
  );
});

test('tester with wrong schema type, but sibling has correct one', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
      numberControlTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'string'
              },
              bar: {
                type: 'number'
              }
            }
          }
      ),
      -1
  );
});

test('tester with machting schema type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
      numberControlTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'number'
              }
            }
          }
      ),
      2
  );
});

test('render', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'number'
      }
    }
  };
  const store = initJsonFormsStore({ 'foo': 3.14 }, schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberControl schema={schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );

  const control = findRenderedDOMElementWithClass(tree, 'control');
  t.not(control, undefined);
  t.is(control.childNodes.length, 3);
  t.not(findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
  t.not(findRenderedDOMElementWithClass(tree, 'valid'), undefined);

  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, 'Foo');

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.type, 'number');
  t.is(input.step, '0.1');
  t.is(input.value, '3.14');

  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('render without label', t => {
  const store = initJsonFormsStore({ 'foo': 2.72 }, t.context.schema, t.context.uischema);
  const uischema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    },
    label: false
  };
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberControl schema={t.context.schema}
                     uischema={uischema}
      />
    </Provider>
  );

  const control = findRenderedDOMElementWithClass(tree, 'control');
  t.not(control, undefined);
  t.is(control.childNodes.length, 3);
  t.not(findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
  t.not(findRenderedDOMElementWithClass(tree, 'valid'), undefined);

  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, '');

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.type, 'number');
  t.is(input.step, '0.1');
  t.is(input.value, '2.72');

  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('update via input event', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberControl schema={t.context.schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = '2.72';
  change(input);
  t.is(getData(store.getState()).foo, 2.72);
});

test('update via action', t => {
  const store = initJsonFormsStore({ 'foo': 2.72 }, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberControl schema={t.context.schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, '2.72');
  store.dispatch(update('foo', () => 3.14));
  setTimeout(() => t.is(input.value, 'Bar'), 3.14);
});

test('update with undefined value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberControl schema={t.context.schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => undefined));
  t.is(input.value, '3.14');
});

test('update with null value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberControl schema={t.context.schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => null));
  t.is(input.value, '3.14');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberControl schema={t.context.schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('bar', () => 11));
  t.is(input.value, '3.14');
});

test('update with null ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberControl schema={t.context.schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(null, () => 2.72));
  t.is(input.value, '3.14');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberControl schema={t.context.schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );
  store.dispatch(update(undefined, () => 13));
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, '3.14');
});

test('hide', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberControl schema={t.context.schema}
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
      <NumberControl schema={t.context.schema}
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
      <NumberControl schema={t.context.schema}
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
      <NumberControl schema={t.context.schema}
                      uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.disabled);
});

test('single error', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberControl schema={t.context.schema}
                     uischema={t.context.uischema}

      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 2));
  store.dispatch(validate());
  t.is(validation.textContent, 'should be >= 5');
});

test('multiple errors', t => {
  const schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'number',
        minimum: 4,
        enum: [4, 6, 8]
      }
    }
  };
  const store = initJsonFormsStore(t.context.data, schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberControl schema={t.context.schema}
                     uischema={t.context.uischema}

      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 3));
  store.dispatch(validate());
  t.is(
    validation.textContent,
    'should be >= 4\nshould be equal to one of the allowed values'
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
      <NumberControl schema={t.context.schema}
                      uischema={t.context.uischema}

      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  t.is(validation.textContent, '');
});

test('reset validation message', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <NumberControl schema={t.context.schema}
                      uischema={t.context.uischema}

      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 3));
  store.dispatch(update('foo', () => 10));
  store.dispatch(validate());
  t.is(validation.textContent, '');
});

test('required field no warning', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            numberField: {
                type: 'number'
            }
        },
        required: ['numberField']
    };
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/numberField'
        }
    };
    const data = {
        numberField: 5
    };
    const store = initJsonFormsStore(
        data,
        schema,
        uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
          <NumberControl schema={schema}
                         uischema={uischema}
          />
        </Provider>
    );
    const label = findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, 'Number Field');
});

test('required field with warning', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            numberField: {
                type: 'number'
            }
        },
        required: ['numberField']
    };
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/numberField'
        }
    };
    const store = initJsonFormsStore(
        {},
        schema,
        uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
          <NumberControl schema={schema}
                         uischema={uischema}
          />
        </Provider>
    );
    const label = findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, 'Number Field*');
});

test('not required', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            numberField: {
                type: 'number'
            }
        }
    };
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/numberField'
        }
    };

    const store = initJsonFormsStore(
        {},
        schema,
        uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
          <NumberControl schema={schema}
                         uischema={uischema}
          />
        </Provider>
    );
    const label = findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, 'Number Field');
});

test('required field with warning when number is 0', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            numberField: {
                type: 'number'
            }
        },
        required: ['numberField']
    };
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/numberField'
        }
    };
    const data = {
        numberField: 0
    };
    const store = initJsonFormsStore(
        data,
        schema,
        uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
          <NumberControl schema={schema}
                         uischema={uischema}
          />
        </Provider>
    );
    const label = findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, 'Number Field*');
});
