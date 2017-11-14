import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import { initJsonFormsStore } from '../helpers/setup';
import { ControlElement } from '../../src/models/uischema';
import EnumControl, { enumControlTester } from '../../src/renderers/controls/enum.control';
import { JsonForms } from '../../src/core';
import { getData } from '../../src/reducers/index';
import { update, validate } from '../../src/actions';
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
  t.context.data = { 'foo': 'a' };
  t.context.schema = {
    'type': 'object',
    'properties': {
      'foo': {
        'type': 'string',
        'enum': ['a', 'b'],
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
// TODO fix autofocus on enum
/*test('autofocus on first element', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            firstEnumField: { type: 'string', enum: ['a', 'b'] },
            secondEnumField: { type: 'string', enum: ['a', 'b'] }
        }
    };
    const firstControlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/firstEnumField'
        },
        options: {
            focus: true
        }
    };
    const secondControlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/secondEnumField'
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
        'firstEnumField': 'a',
        'secondEnumField': 'b'
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
    const activeElement = document.activeElement.getElementsByTagName('select')[0].id;
    t.is(activeElement, '#/properties/firstEnumField');
    t.not(activeElement, '#/properties/secondEnumField');
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
            <EnumControl schema={t.context.schema}
                         uischema={uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'select') as HTMLInputElement;
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
            <EnumControl schema={t.context.schema}
                         uischema={uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'select') as HTMLInputElement;
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
            <EnumControl schema={t.context.schema}
                         uischema={uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'select') as HTMLInputElement;
    t.false(input.autofocus);
});*/

test('tester', t => {
  t.is(enumControlTester(undefined, undefined), -1);
  t.is(enumControlTester(null, undefined), -1);
  t.is(enumControlTester({type: 'Foo'}, undefined), -1);
  t.is(enumControlTester({type: 'Control'}, undefined), -1);
});

test('tester with wrong prop type', t => {
  t.is(
    enumControlTester(
      t.context.uischema,
      { type: 'object', properties: {foo: {type: 'string'}} }
    ),
    -1
  );
});

test('tester with wrong prop type, but sibling has correct one', t => {
  t.is(
      enumControlTester(
          t.context.uischema,
          {
            'type': 'object',
            'properties': {
              'foo': {
                'type': 'string'
              },
              'bar': {
                'type': 'string',
                'enum': ['a', 'b']
              }
            }
          }
      ),
      -1
  );
});

test('tester with matching string type', t => {
  t.is(
      enumControlTester(
          t.context.uischema,
          {
            'type': 'object',
            'properties': {
              'foo': {
                'type': 'string',
                'enum': ['a', 'b']
              }
            }
          }
      ),
      2
  );
});

test('tester with matching numeric type', t => {
  // TODO should this be true?
  t.is(
      enumControlTester(
          t.context.uischema,
          {
            'type': 'object',
            'properties': {
              'foo': {
                'type': 'number',
                'enum': [1, 2]
              }
            }
          }
      ),
      2
  );
});

test('render', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <EnumControl schema={t.context.schema}
                      uischema={t.context.uischema}
      />
    </Provider>
  );

  const control = findRenderedDOMElementWithClass(tree, 'control');
  t.not(control, undefined);
  t.is(control.childNodes.length, 3);
  t.not(findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
  t.not(findRenderedDOMElementWithClass(tree, 'valid'), undefined);
  t.not(findRenderedDOMElementWithClass(tree, 'control'), undefined);

  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, 'Foo');

  const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
  t.is(select.tagName, 'SELECT');
  t.is(select.value, 'a');
  t.is(select.options.length, 3);
  t.is(select.options.item(0).value, '');
  t.is(select.options.item(1).value, 'a');
  t.is(select.options.item(2).value, 'b');

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
  const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <EnumControl schema={t.context.schema}
                   uischema={uischema}
      />
    </Provider>
  );

  const control = findRenderedDOMElementWithClass(tree, 'control');
  t.not(control, undefined);
  t.is(control.childNodes.length, 3);
  t.not(findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
  t.not(findRenderedDOMElementWithClass(tree, 'valid'), undefined);
  t.not(findRenderedDOMElementWithClass(tree, 'control'), undefined);

  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, '');

  const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
  t.is(select.tagName, 'SELECT');
  t.is(select.value, 'a');
  t.is(select.options.length, 3);
  t.is(select.options.item(0).value, '');
  t.is(select.options.item(1).value, 'a');
  t.is(select.options.item(2).value, 'b');

  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('update via input event', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <EnumControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );

  const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
  select.value = 'b';
  change(select);
  t.is(getData(store.getState()).foo, 'b');
});

test('update via action', t => {
  const data = { 'foo': 'b' };
  const store = initJsonFormsStore(data,  t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <EnumControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
  store.dispatch(
    update(
      'foo',
      () => 'b'
    )
  );
  t.is(select.value, 'b');
  t.is(select.selectedIndex, 2);
});

test('update with undefined value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <EnumControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
  store.dispatch(
    update(
      'foo',
      () => undefined
    )
  );
  t.is(select.selectedIndex, 1);
  t.is(select.value, 'a');
});

test('update with null value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <EnumControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
  store.dispatch(
    update(
      'foo',
      () => null
    )
  );
  t.is(select.selectedIndex, 1);
  t.is(select.value, 'a');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <EnumControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
  store.dispatch(
    update(
      'bar',
      () => 'Bar'
    )
  );
  t.is(select.selectedIndex, 1);
  t.is(select.value, 'a');
});

test('update with null ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <EnumControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
  store.dispatch(
    update(
      null,
      () => false
    )
  );
  t.is(select.selectedIndex, 1);
  t.is(select.value, 'a');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <EnumControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
  store.dispatch(
    update(
      undefined,
      () => false
    )
  );
  t.is(select.selectedIndex, 1);
  t.is(select.value, 'a');
});

test('hide', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <EnumControl schema={t.context.schema}
                   uischema={t.context.uischema}
                   visible={false}
      />
    </Provider>
  );
  const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
  t.true(select.hidden);
});

test('show by default', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <EnumControl schema={t.context.schema}
                      uischema={t.context.uischema}
      />
    </Provider>
  );
  const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
  t.false(select.hidden);
});
//
test('disable', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <EnumControl schema={t.context.schema}
                   uischema={t.context.uischema}
                   enabled={false}
      />
    </Provider>
  );
  const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
  t.true(select.disabled);
});

test('enabled by default', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <EnumControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
  t.false(select.disabled);
});

test('single error', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <EnumControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 'c'));
  store.dispatch(validate());
  t.is(validation.textContent, 'should be equal to one of the allowed values');
});

test('multiple errors', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <EnumControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 3));
  store.dispatch(validate());
  t.is(
    validation.textContent,
    'should be equal to one of the allowed values\nshould be string'
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
      <EnumControl schema={t.context.schema}
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
      <EnumControl schema={t.context.schema}
                      uischema={t.context.uischema}

      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 'c'));
  store.dispatch(update('foo', () => 'a'));
  store.dispatch(validate());
  t.is(validation.textContent, '');
});
