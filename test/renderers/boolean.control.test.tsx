import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import { initJsonFormsStore } from '../helpers/setup';
import { ControlElement, HorizontalLayout } from '../../src/models/uischema';
import { JsonSchema } from '../../src/models/jsonSchema';
import BooleanControl, { booleanControlTester } from '../../src/renderers/controls/boolean.control';
import { HorizontalLayoutRenderer } from '../../src/renderers/layouts/horizontal.layout';
import { JsonForms } from '../../src/core';
import '../helpers/setup';
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
    scope: {
      $ref: '#/properties/foo'
    }
  };
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
        scope: {
            $ref: '#/properties/firstBooleanField'
        },
        options: {
            focus: true
        }
    };
    const secondControlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/secondBooleanField'
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
        'firstBooleanField': true,
        'secondBooleanField': false
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
    t.is(activeElement, '#/properties/firstBooleanField');
    t.not(activeElement, '#/properties/secondBooleanField');
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
            <BooleanControl schema={t.context.schema}
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
            <BooleanControl schema={t.context.schema}
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
            <BooleanControl schema={t.context.schema}
                            uischema={uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.false(input.autofocus);
});

test('tester', t => {
  t.is(booleanControlTester(undefined, undefined), -1);
  t.is(booleanControlTester(null, undefined), -1);
  t.is(booleanControlTester({type: 'Foo'}, undefined), -1);
  t.is(booleanControlTester({type: 'Control'}, undefined), -1);
});

test('tester with wrong prop type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
      booleanControlTester(
          control,
          {type: 'object', properties: {foo: {type: 'string'}}}
      ),
      -1
  );
});

test('tester with wrong prop type, but sibling has correct one', t => {
  const control = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
      booleanControlTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'string'
              },
              bar: {
                type: 'boolean'
              }
            }
          }
      ),
      -1
  );
});

test('tester with matching prop type', t => {
  const control = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
      booleanControlTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'boolean'
              }
            }
          }
      ),
      2);
});

test('render', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <BooleanControl schema={t.context.schema}
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
  t.is(input.type, 'checkbox');
  t.is(input.checked, true);

  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('render without label', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    },
    label: false
  };
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <BooleanControl schema={t.context.schema}
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
  t.is(input.type, 'checkbox');
  t.is(input.checked, true);

  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('update via input event', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <BooleanControl schema={t.context.schema}
                      uischema={t.context.uischema}
      />
    </Provider>
  );

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.checked = false;
  change(input);
  // const evt = new Event('click', {
  //   'bubbles': true,
  //   'cancelable': true
  // });
  // input.dispatchEvent(evt);
  t.is(getData(store.getState()).foo, false);
});

test('update via action', t => {
  const data = { 'foo': false };
  const store = initJsonFormsStore(data,  t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <BooleanControl schema={t.context.schema}
                      uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(
    update(
      'foo',
      () => false
    )
  );
  t.is(input.checked, false);
  t.is(getData(store.getState()).foo, false);
});

test('update with undefined value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <BooleanControl schema={t.context.schema}
                      uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(
    update(
      'foo',
      () => undefined
    )
  );
  t.is(input.value, '');
});

test('update with null value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <BooleanControl schema={t.context.schema}
                      uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(
    update(
      'foo',
      () => null
    )
  );
  t.is(input.value, '');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <BooleanControl schema={t.context.schema}
                      uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(
    update(
      'bar',
      () => 11
    )
  );
  t.is(input.checked, true);
});

test('update with null ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <BooleanControl schema={t.context.schema}
                      uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(null, () => false));
  t.is(input.checked, true);
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <BooleanControl schema={t.context.schema}
                      uischema={t.context.uischema}
      />
    </Provider>
  );
  store.dispatch(update(undefined, () => false));
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.checked, true);
});

test('hide', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
    <BooleanControl schema={t.context.schema}
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
    <BooleanControl schema={t.context.schema}
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
    <BooleanControl schema={t.context.schema}
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
      <BooleanControl schema={t.context.schema}
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
      <BooleanControl schema={t.context.schema}
                      uischema={t.context.uischema}
      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 2));
  store.dispatch(validate());
  t.is(validation.textContent, 'should be boolean');
});

test('multiple errors', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
    <BooleanControl schema={t.context.schema}
                    uischema={t.context.uischema}

    />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 3));
  store.dispatch(validate());
  t.is(
    validation.textContent,
    'should be boolean'
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
    <BooleanControl schema={t.context.schema}
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
    <BooleanControl schema={t.context.schema}
  uischema={t.context.uischema}

/>
  </Provider>
);
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 3));
  store.dispatch(update('foo', () => true));
  store.dispatch(validate());
  t.is(validation.textContent, '');
});
