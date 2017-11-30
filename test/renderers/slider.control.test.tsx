import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import { JsonForms } from '../../src/core';
import { initJsonFormsStore } from '../helpers/setup';
import { ControlElement } from '../../src/models/uischema';
import { update, validate } from '../../src/actions';
import SliderControl, { sliderControlTester } from '../../src/renderers/controls/slider.control';
import { JsonSchema } from '../../src/models/jsonSchema';
import { getData } from '../../src/reducers/index';
import {
  change,
  findRenderedDOMElementWithClass,
  findRenderedDOMElementWithTag,
  renderIntoDocument
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
  t.context.data = {'foo': 5};
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'number',
        maximum: 10,
        minimum: 2
      },
    },
  };
  t.context.uischema = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo',
    },
    options: {
      slider: true
    }
  };
});

test('tester', t => {
  t.is(sliderControlTester(undefined, undefined), -1);
  t.is(sliderControlTester(null, undefined), -1);
  t.is(sliderControlTester({type: 'Foo'}, undefined), -1);
  t.is(sliderControlTester({type: 'Control'}, undefined), -1);
});

test('tester with wrong schema type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    },
    options: {
      slider: true
    }
  };
  t.is(
    sliderControlTester(
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
    },
    options: {
      slider: true
    }
  };
  t.is(
    sliderControlTester(
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

test('tester with matching schema type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    },
    options: {
      slider: true
    }
  };
  t.is(
    sliderControlTester(
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
    4
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
  const store = initJsonFormsStore({ 'foo': 5 }, schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderControl schema={schema}
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
  t.is(input.type, 'range');
  t.is(input.value, '5');

  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('render without label', t => {
  const store = initJsonFormsStore({ 'foo': 3 }, t.context.schema, t.context.uischema);
  const uischema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    },
    options: {
      slider: true
    },
    label: false
  };
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderControl schema={t.context.schema}
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
  t.is(input.type, 'range');
  t.is(input.value, '3');

  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('update via input event', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderControl schema={t.context.schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = '3';
  change(input);
  t.is(getData(store.getState()).foo, 3);
});

test('update via action', t => {
  const store = initJsonFormsStore({ 'foo': 3 }, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderControl schema={t.context.schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, '3');
  store.dispatch(update('foo', () => 4));
  setTimeout(() => t.is(input.value, 'Bar'), 4);
});

test('update with undefined value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderControl schema={t.context.schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => undefined));
  t.is(input.value, '5');
});

test('update with null value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderControl schema={t.context.schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => null));
  t.is(input.value, '5');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderControl schema={t.context.schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('bar', () => 11));
  t.is(input.value, '5');
});

test('update with null ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderControl schema={t.context.schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(null, () => 2));
  t.is(input.value, '5');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderControl schema={t.context.schema}
                     uischema={t.context.uischema}
      />
    </Provider>
  );
  store.dispatch(update(undefined, () => 13));
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, '5');
});

test('hide', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderControl schema={t.context.schema}
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
      <SliderControl schema={t.context.schema}
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
      <SliderControl schema={t.context.schema}
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
      <SliderControl schema={t.context.schema}
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
      <SliderControl schema={t.context.schema}
                     uischema={t.context.uischema}

      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 1));
  store.dispatch(validate());
  t.is(validation.textContent, 'should be >= 2');
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
      <SliderControl schema={t.context.schema}
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
      <SliderControl schema={t.context.schema}
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
      <SliderControl schema={t.context.schema}
                     uischema={t.context.uischema}

      />
    </Provider>
  );
  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  store.dispatch(update('foo', () => 1));
  store.dispatch(update('foo', () => 6));
  store.dispatch(validate());
  t.is(validation.textContent, '');
});
