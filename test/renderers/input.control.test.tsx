import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import { initJsonFormsStore } from '../helpers/setup';
import { ControlElement, HorizontalLayout } from '../../src/models/uischema';
import { JsonSchema } from '../../src/models/jsonSchema';
import InputControl, { inputControlTester } from '../../src/renderers/controls/input.control';
import '../../src/renderers/fields/text.field';
import { HorizontalLayoutRenderer } from '../../src/renderers/layouts/horizontal.layout';
import { JsonForms } from '../../src/core';
import '../helpers/setup';
import { update, validate } from '../../src/actions';
import { getData } from '../../src/reducers/index';
import { isControl, rankWith } from '../../src/core/testers';
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

test('tester', t => {
  t.is(inputControlTester(undefined, undefined), -1);
  t.is(inputControlTester(null, undefined), -1);
  t.is(inputControlTester({type: 'Foo'}, undefined), -1);
  t.is(inputControlTester({type: 'Control'}, undefined), -1);
  const control: ControlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}};
  t.is(inputControlTester(control, undefined), 1);
});

test('render', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={t.context.schema}
                      uischema={t.context.uischema}
      />
    </Provider>
  );

  const control = findRenderedDOMElementWithClass(tree, 'control');
  t.not(control, undefined);
  t.is(control.childNodes.length, 3);
  t.not(findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
  /*t.not(findRenderedDOMElementWithClass(tree, 'valid'), undefined);*/

  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, 'Foo');

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;

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
      <InputControl schema={t.context.schema}
                      uischema={uischema}
      />
    </Provider>
  );

  const control = findRenderedDOMElementWithClass(tree, 'control');
  t.not(control, undefined);
  t.is(control.childNodes.length, 3);
  t.not(findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
  /*t.not(findRenderedDOMElementWithClass(tree, 'valid'), undefined);*/

  const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, '');

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;

  const validation = findRenderedDOMElementWithClass(tree, 'validation');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});
// TODO: why are we hiding only the input?
test.skip('hide', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
    <InputControl schema={t.context.schema}
  uischema={t.context.uischema}
  visible={false}
    />
    </Provider>
);
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.true(input.hidden);
});

test.skip('show by default', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
    <InputControl schema={t.context.schema}
  uischema={t.context.uischema}
/>
  </Provider>
);
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.hidden);
});

test('single error', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={t.context.schema}
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
    <InputControl schema={t.context.schema}
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
    <InputControl schema={t.context.schema}
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
    <InputControl schema={t.context.schema}
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

test('validation of nested schema', t => {
  const schema = {
    'type': 'object',
    'properties': {
       'name': {
          'type': 'string'
       },
       'personalData': {
          'type': 'object',
          'properties': {
             'middleName': {
                 'type': 'string'
             },
             'lastName': {
                 'type': 'string'
             }
          },
          'required': ['middleName', 'lastName']
       }
    },
    'required': ['name']
  };
  const firstControlElement: ControlElement = {
    type: 'Control',
    scope: {
        $ref: '#/properties/name'
    }
  };
  const secondControlElement: ControlElement = {
    type: 'Control',
    scope: {
        $ref: '#/properties/personalData/properties/middleName'
    }
  };
  const thirdControlElement: ControlElement = {
    type: 'Control',
    scope: {
        $ref: '#/properties/personalData/properties/lastName'
    }
  };
  const uischema: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: [
        firstControlElement,
        secondControlElement,
        thirdControlElement
    ]
  };
  const data = {
    name: 'John Doe',
    personalData: {}
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
  const validation = scryRenderedDOMElementsWithClass(tree, 'validation');
  store.dispatch(validate());
  t.is(validation[0].textContent, '');
  t.is(validation[1].textContent, 'is a required property');
  t.is(validation[2].textContent, 'is a required property');
});
