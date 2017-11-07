import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import { initJsonFormsStore } from '../helpers/setup';
import { JsonSchema } from '../../src/models/jsonSchema';
import { ControlElement } from '../../src/models/uischema';
import ArrayControlRenderer, { arrayTester } from '../../src/renderers/additional/array-renderer';
import { JsonForms } from '../../src/core';
import {
  findRenderedDOMElementWithClass,
  findRenderedDOMElementWithTag,
  renderIntoDocument
} from 'inferno-test-utils';
import { Provider } from 'inferno-redux';
import { update } from '../../src/actions';
import { getData } from '../../src/reducers/index';

test.before(() => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'array.layout',
      classNames: ['array-layout']
    },
    {
      name: 'array.children',
      classNames: ['children']
    }
  ]);
});

test.beforeEach(t => {
  t.context.data = {
    'test': [{
      x: 1,
      y: 3
    }]
  };
  t.context.schema = {
    type: 'object',
    properties: {
      test: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            x: { type: 'integer' },
            y: { type: 'integer' }
          }
        }
      }
    }
  };
  t.context.uischema = {
    'type': 'Control',
    'scope': {
      '$ref': '#/properties/test'
    }
  };
});

test('render', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <ArrayControlRenderer schema={t.context.schema}
                            uischema={t.context.uischema}
      />
    </Provider>
  );

  const fieldSet = findRenderedDOMElementWithClass(tree, 'array-layout') as HTMLFieldSetElement;
  const legend = fieldSet.children.item(0);
  const legendChildren = legend.children;
  const label = legendChildren.item(1);
  const button = legendChildren.item(0);
  const children = fieldSet.children.item(1);

  t.not(findRenderedDOMElementWithClass(tree, 'root_properties_test'), undefined);
  t.is(fieldSet.tagName, 'FIELDSET');
  t.is(fieldSet.children.length, 2);
  t.is(legend.tagName, 'LEGEND');
  t.is(label.tagName, 'LABEL');
  t.is(label.innerHTML, 'Test');
  t.is(button.tagName, 'BUTTON');
  t.is(children.tagName, 'DIV');
  t.is(children.className, 'children');
  t.is(children.children.length, 1);
});

test('add data via click - empty array case', t => {
  const data = {};
  const store = initJsonFormsStore(data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <ArrayControlRenderer schema={t.context.schema}
                            uischema={t.context.uischema}
      />
    </Provider>
  );
  const button = findRenderedDOMElementWithTag(tree, 'button') as HTMLButtonElement;
  button.click();
  t.is(getData(store.getState()).test.length, 1);
});

test('add data via click', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <ArrayControlRenderer schema={t.context.schema}
                            uischema={t.context.uischema}
      />
    </Provider>
  );
  const button = findRenderedDOMElementWithTag(tree, 'button') as HTMLButtonElement;
  button.click();
  t.is(getData(store.getState()).test.length, 2);
});

test('update via action', t => {
  JsonForms.schema = t.context.schema;
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <ArrayControlRenderer schema={t.context.schema}
                            uischema={t.context.uischema}
      />
    </Provider>
  );

  const children = findRenderedDOMElementWithClass(tree, 'children');
  store.dispatch(
    update(
      'test',
      () => [{x: 1, y: 3}, {x: 2, y: 3}]
    )
  );

  t.is(children.childNodes.length, 2);
  t.is(getData(store.getState()).test.length, 2);
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <ArrayControlRenderer schema={t.context.schema}
                            uischema={t.context.uischema}
      />
    </Provider>
  );
  const children = findRenderedDOMElementWithClass(tree, 'children');
  store.dispatch(
    update(
      undefined,
      () => [{x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}]
    )
  );
  t.is(children.childNodes.length, 1);
  t.is(getData(store.getState()).test.length, 1);
});

test('tester with unknown type', t => {
  t.is(arrayTester({type: 'Foo'}, null), -1);
});

test('tester with document ref', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#'
    }
  };
  t.is(arrayTester(uischema, undefined), -1);
});

test('tester with wrong prop type', t => {
  const uischema = {
    type: 'Control',
    scope: {
      $ref: '#/properties/x'
    }
  };
  t.is(
    arrayTester(
      uischema,
      {
        type: 'object',
        properties: {
          x: {
            type: 'integer'
          }
        }
      }
    ),
    -1
  );
});

test('tester with missing items prop', t => {
  t.is(
    arrayTester(
      t.context.uischema,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'array'
          }
        }
      }
    ),
    -1
  );
});

test('tester with tuple type', t => {
  t.is(
    arrayTester(
      t.context.uischema,
      {
        type: 'object',
        properties:
          {
            foo: {
              type: 'array',
              items: [
                { type: 'integer' },
                { type: 'string' },
              ]
            }
          }
      }
    ),
    -1
  );
});

test('tester with primitive type', t => {
  t.is(
    arrayTester(
      t.context.uischema,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'array',
            items: { type: 'integer' }
          }
        }
      }
    ),
    -1
  );
});

test('tester with correct prop type', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      test: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            x: { type: 'integer' },
            y: { type: 'integer' }
          }
        }
      }
    }
  };
  t.is(arrayTester(t.context.uischema, schema), 2);
});
