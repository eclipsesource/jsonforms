import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import { initJsonFormsStore } from '../helpers/setup';
import { ControlElement } from '../../src/models/uischema';
import AutocompleteControl, { autocompleteControlTester } from '../../src/renderers/controls/autocomplete.control';
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
        'enum': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'],
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

test('tester', t => {
  t.is(autocompleteControlTester(undefined, undefined), -1);
  t.is(autocompleteControlTester(null, undefined), -1);
  t.is(autocompleteControlTester({type: 'Foo'}, undefined), -1);
  t.is(autocompleteControlTester({type: 'Control'}, undefined), -1);
});

test('tester with wrong prop type', t => {
  t.is(
    autocompleteControlTester(
      t.context.uischema,
      { type: 'object', properties: {foo: {type: 'string'}} }
    ),
    -1
  );
});

test('tester with wrong prop type, but sibling has correct one', t => {
  t.is(
      autocompleteControlTester(
          t.context.uischema,
          {
            'type': 'object',
            'properties': {
              'foo': {
                'type': 'string'
              },
              'bar': {
                'type': 'string',
                'enum': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o']
              }
            }
          }
      ),
      -1
  );
});

test('tester with matching string type', t => {
  t.is(
      autocompleteControlTester(
          t.context.uischema,
          {
            'type': 'object',
            'properties': {
              'foo': {
                'type': 'string',
                'enum': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o']
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
      autocompleteControlTester(
          t.context.uischema,
          {
            'type': 'object',
            'properties': {
              'foo': {
                'type': 'number',
                'enum': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
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
      <AutocompleteControl schema={t.context.schema}
                      uischema={t.context.uischema}
      />
    </Provider>
  );

  const control = findRenderedDOMElementWithClass(tree, 'control');
  t.not(control, undefined);
  t.is(control.childNodes.length, 4);
  t.not(findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
  t.not(findRenderedDOMElementWithClass(tree, 'valid'), undefined);
  t.not(findRenderedDOMElementWithClass(tree, 'control'), undefined);

  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, 'Foo');

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, 'a');

  const datalist = findRenderedDOMElementWithTag(tree, 'datalist') as HTMLDataListElement;
  t.is(datalist.tagName, 'DATALIST');
  t.is(datalist.childNodes.length, 15);
  t.is(datalist.childNodes.item(0).attributes.getNamedItem('value').value, 'a');
  t.is(datalist.childNodes.item(1).attributes.getNamedItem('value').value, 'b');
  t.is(datalist.childNodes.item(2).attributes.getNamedItem('value').value, 'c');
  t.is(datalist.childNodes.item(3).attributes.getNamedItem('value').value, 'd');
  t.is(datalist.childNodes.item(4).attributes.getNamedItem('value').value, 'e');
  t.is(datalist.childNodes.item(5).attributes.getNamedItem('value').value, 'f');
  t.is(datalist.childNodes.item(6).attributes.getNamedItem('value').value, 'g');
  t.is(datalist.childNodes.item(7).attributes.getNamedItem('value').value, 'h');
  t.is(datalist.childNodes.item(8).attributes.getNamedItem('value').value, 'i');
  t.is(datalist.childNodes.item(9).attributes.getNamedItem('value').value, 'j');
  t.is(datalist.childNodes.item(10).attributes.getNamedItem('value').value, 'k');
  t.is(datalist.childNodes.item(11).attributes.getNamedItem('value').value, 'l');
  t.is(datalist.childNodes.item(12).attributes.getNamedItem('value').value, 'm');
  t.is(datalist.childNodes.item(13).attributes.getNamedItem('value').value, 'n');
  t.is(datalist.childNodes.item(14).attributes.getNamedItem('value').value, 'o');

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
      <AutocompleteControl schema={t.context.schema}
                   uischema={uischema}
      />
    </Provider>
  );

  const control = findRenderedDOMElementWithClass(tree, 'control');
  t.not(control, undefined);
  t.is(control.childNodes.length, 4);
  t.not(findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
  t.not(findRenderedDOMElementWithClass(tree, 'valid'), undefined);
  t.not(findRenderedDOMElementWithClass(tree, 'control'), undefined);

  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, '');

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, 'a');

  const datalist = findRenderedDOMElementWithTag(tree, 'datalist') as HTMLDataListElement;
  t.is(datalist.tagName, 'DATALIST');
  t.is(datalist.childNodes.length, 15);
  t.is(datalist.childNodes.item(0).attributes.getNamedItem('value').value, 'a');
  t.is(datalist.childNodes.item(1).attributes.getNamedItem('value').value, 'b');
  t.is(datalist.childNodes.item(2).attributes.getNamedItem('value').value, 'c');
  t.is(datalist.childNodes.item(3).attributes.getNamedItem('value').value, 'd');
  t.is(datalist.childNodes.item(4).attributes.getNamedItem('value').value, 'e');
  t.is(datalist.childNodes.item(5).attributes.getNamedItem('value').value, 'f');
  t.is(datalist.childNodes.item(6).attributes.getNamedItem('value').value, 'g');
  t.is(datalist.childNodes.item(7).attributes.getNamedItem('value').value, 'h');
  t.is(datalist.childNodes.item(8).attributes.getNamedItem('value').value, 'i');
  t.is(datalist.childNodes.item(9).attributes.getNamedItem('value').value, 'j');
  t.is(datalist.childNodes.item(10).attributes.getNamedItem('value').value, 'k');
  t.is(datalist.childNodes.item(11).attributes.getNamedItem('value').value, 'l');
  t.is(datalist.childNodes.item(12).attributes.getNamedItem('value').value, 'm');
  t.is(datalist.childNodes.item(13).attributes.getNamedItem('value').value, 'n');
  t.is(datalist.childNodes.item(14).attributes.getNamedItem('value').value, 'o');

  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('update via input event', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <AutocompleteControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = 'b';
  change(input);
  t.is(getData(store.getState()).foo, 'b');
});

test('update via action', t => {
  const data = { 'foo': 'b' };
  const store = initJsonFormsStore(data,  t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <AutocompleteControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(
    update(
      'foo',
      () => 'b'
    )
  );
  t.is(input.value, 'b');
});

test('update with undefined value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <AutocompleteControl schema={t.context.schema}
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
  t.is(input.value, 'a');
});

test('update with null value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <AutocompleteControl schema={t.context.schema}
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
  t.is(input.value, 'a');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <AutocompleteControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(
    update(
      'bar',
      () => 'Bar'
    )
  );
  t.is(input.value, 'a');
});

test('update with null ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <AutocompleteControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(
    update(
      null,
      () => false
    )
  );
  t.is(input.value, 'a');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <AutocompleteControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(
    update(
      undefined,
      () => false
    )
  );
  t.is(input.value, 'a');
});

test('hide', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <AutocompleteControl schema={t.context.schema}
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
      <AutocompleteControl schema={t.context.schema}
                      uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.hidden);
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
      <AutocompleteControl schema={t.context.schema}
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
      <AutocompleteControl schema={t.context.schema}
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
      <AutocompleteControl schema={t.context.schema}
                   uischema={t.context.uischema}
      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 'z'));
  store.dispatch(validate());
  t.is(validation.textContent, 'should be equal to one of the allowed values');
});

test('multiple errors', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <AutocompleteControl schema={t.context.schema}
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
      <AutocompleteControl schema={t.context.schema}
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
      <AutocompleteControl schema={t.context.schema}
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
