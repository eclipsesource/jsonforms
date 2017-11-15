import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import DateControl, { dateControlTester } from '../../src/renderers/controls/date.control';
import { ControlElement, HorizontalLayout } from '../../src/models/uischema';
import { HorizontalLayoutRenderer } from '../../src/renderers/layouts/horizontal.layout';
import { JsonForms } from '../../src/core';
import { getData } from '../../src/reducers/index';
import { update, validate } from '../../src/actions';
import { JsonSchema } from '../../src/models/jsonSchema';
import { initJsonFormsStore } from '../helpers/setup';
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
  t.context.data = { 'foo': '1980-04-04' };
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        format: 'date'
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
            firstDate: { type: 'string', format: 'date' },
            secondDate: { type: 'string', format: 'date' }
        }
    };
    const firstControlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/firstDate'
        },
        options: {
            focus: true
        }
    };
    const secondControlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/secondDate'
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
        'firstDate': '1980-04-04',
        'secondDate': '1980-04-04'
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
    t.is(activeElement, '#/properties/firstDate');
    t.not(activeElement, '#/properties/secondDate');
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
            <DateControl schema={t.context.schema}
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
            <DateControl schema={t.context.schema}
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
            <DateControl schema={t.context.schema}
                            uischema={uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.false(input.autofocus);
});

test('tester', t => {
  t.is(dateControlTester(undefined, undefined), -1);
  t.is(dateControlTester(null, undefined), -1);
  t.is(dateControlTester({ type: 'Foo' }, undefined), -1);
  t.is(dateControlTester({ type: 'Control' }, undefined), -1);
});

test('tester with wrong prop type', t => {
  t.is(
      dateControlTester(
          t.context.uischmea,
          {
            type: 'object',
            properties: {
              foo: { type: 'string' },
            },
          },
      ),
      -1,
  );
});

test('tester with wrong prop type, but sibling has correct one', t => {
  t.is(
      dateControlTester(
          t.context.uischema,
          {
            type: 'object',
            properties: {
              foo: { type: 'string' },
              bar: {
                type: 'string',
                format: 'date',
              },
            },
          },
      ),
      -1,
  );
});

test('tester with correct prop type', t => {
  t.is(
    dateControlTester(
      t.context.uischema,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            format: 'date',
          },
        },
      },
    ),
    2,
  );
});

test('render', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );

  const control = findRenderedDOMElementWithClass(tree, 'control');
  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  const validation = findRenderedDOMElementWithClass(tree, 'validation');

  t.not(control, undefined);
  t.is(control.childNodes.length, 3);
  t.not(findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
  t.not(findRenderedDOMElementWithClass(tree, 'valid'), undefined);
  t.is(label.textContent, 'Foo');
  t.is(input.type, 'date');
  t.is(input.value, '1980-04-04');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('render without label', t => {
  const uischema = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo',
    },
    label: false,
  };
  const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateControl schema={t.context.schema}
                   uischema={uischema}
      />
    </Provider>
  );

  const control = findRenderedDOMElementWithClass(tree, 'control');
  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  const validation = findRenderedDOMElementWithClass(tree, 'validation');

  t.not(control, undefined);
  t.is(control.childNodes.length, 3);
  t.not(findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
  t.not(findRenderedDOMElementWithClass(tree, 'valid'), undefined);
  t.is(label.textContent, '');
  t.is(input.type, 'date');
  t.is(input.value, '1980-04-04');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('update via event', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = '1961-04-12';
  change(input);
  setTimeout(() => t.is(getData(store.getState()).foo, '1961-04-12'), 100);
});

test('update via action', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => '1961-04-12'));
  setTimeout(() => t.is(input.value, '1961-04-12'), 100);
});

test.failing('update with null value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = '';
  change(input);
  // FIXME: how does reset of date value look like?
  t.is(getData(store.getState()).foo, '1970-01-01');
});

test.failing('update with undefined value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = undefined;
  change(input);
  t.is(getData(store.getState()).foo, '1970-01-01');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = undefined;
  change(input);
  store.dispatch(
    update(
      'bar',
      () => 'Bar'
  ));
  t.is(input.value, '1980-04-04');
});

test('update with null ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = undefined;
  change(input);
  store.dispatch(
    update(
      null,
      () => '1961-04-12'
    ));
  t.is(input.value, '1980-04-04');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = undefined;
  change(input);
  store.dispatch(
    update(
      undefined,
      () => '1961-04-12'
    ));
  t.is(input.value, '1980-04-04');
});

test('hide', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateControl schema={t.context.schema}
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
      <DateControl schema={t.context.schema}
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
      <DateControl schema={t.context.schema}
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
      <DateControl schema={t.context.schema}
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
      <DateControl schema={t.context.schema}
                      uischema={t.context.uischema}

      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 2));
  store.dispatch(validate());
  t.is(validation.textContent, 'should be string');
});

test('multiple errors', t => {
  const schema = {
    'type': 'object',
    'properties': {
      'foo': {
        'type': 'string',
        'format': 'date',
        'enum': ['1985-01-01']
      }
    }
  };
  const store = initJsonFormsStore(t.context.data, schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DateControl schema={t.context.schema}
                      uischema={t.context.uischema}

      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 3));
  store.dispatch(validate());
  t.is(
    validation.textContent,
    'should be string\nshould be equal to one of the allowed values'
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
      <DateControl schema={t.context.schema}
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
      <DateControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 3));
  store.dispatch(
    update(
      'foo',
      () => '1961-04-12'
    )
  );
  store.dispatch(validate());
  t.is(validation.textContent, '');
});

test('required field no warning', t => {
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
        scope: {
            $ref: '#/properties/dateField'
        }
    };
    const data = {
        dateField: '1980-04-04'
    };
    const store = initJsonFormsStore(
        data,
        schema,
        uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
          <DateControl schema={schema}
                           uischema={uischema}
          />
        </Provider>
    );
    const label = findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, 'Date Field');
});

test('required field with warning', t => {
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
        scope: {
            $ref: '#/properties/dateField'
        }
    };

    const store = initJsonFormsStore(
        {},
        schema,
        uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
          <DateControl schema={schema}
                       uischema={uischema}
          />
        </Provider>
    );
    const label = findRenderedDOMElementWithTag(tree, 'label');
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
        scope: {
            $ref: '#/properties/dateField'
        }
    };

    const store = initJsonFormsStore(
        {},
        schema,
        uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
          <DateControl schema={schema}
                       uischema={uischema}
          />
        </Provider>
    );
    const label = findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, 'Date Field');
});
