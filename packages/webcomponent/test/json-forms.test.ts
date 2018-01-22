import '../../test/helpers/setup';
import test from 'ava';
import { JsonFormsElement } from '../src/json-forms';
import './FakeControl';
import './FakeLayout';
import { ControlElement, generateDefaultUISchema, generateJsonSchema } from '@jsonforms/core';

test.beforeEach(t => {
  t.context.data = { name: 'foo' };
  t.context.schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
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

test.cb('render with data set', t => {
  const jsonForms = new JsonFormsElement();
  const jsonSchema = generateJsonSchema(t.context.data);
  jsonForms.state = {
    data: t.context.data,
    schema: jsonSchema,
    uischema: generateDefaultUISchema(jsonSchema),
  };
  jsonForms.connectedCallback();

  setTimeout(
    () => {
      t.is(jsonForms.children.length, 1);
      t.is(jsonForms.children.item(0).className, 'layout');
      t.deepEqual(jsonForms.store.getState().common.schema, jsonSchema);
      t.deepEqual(jsonForms.store.getState().common.uischema, generateDefaultUISchema(jsonSchema));
      t.end();
    },
    100
  );
});

test.cb('render with data and data schema set', t => {
  t.plan(4);
  const jsonForms = new JsonFormsElement();
  jsonForms.state = {
    data: t.context.data,
    schema: t.context.schema,
  };
  setTimeout(
    () => {
      jsonForms.connectedCallback();
      t.is(jsonForms.children.length, 1);
      t.is(jsonForms.children.item(0).className, 'layout');
      t.deepEqual(jsonForms.store.getState().common.schema.properties, t.context.schema.properties);
      t.deepEqual(
        jsonForms.store.getState().common.uischema,
        generateDefaultUISchema(t.context.schema)
      );
      t.end();
    },
    100
  );
});

test('render with data and UI schema set', t => {
  const jsonForms = new JsonFormsElement();
  const uischema: ControlElement = t.context.uischema;
  jsonForms.state = {
    data: t.context.data,
    uischema: t.context.uischema,
  };
  jsonForms.connectedCallback();
  t.is(jsonForms.children.length, 1);
  t.is(jsonForms.children.item(0).className, 'root_properties_name');
  t.deepEqual(jsonForms.store.getState().common.schema, generateJsonSchema({ name: 'foo' }));
  t.is(jsonForms.store.getState().common.uischema, uischema);
});

test.cb('render with data, data schema and UI schema set', t => {
  t.plan(4);
  const jsonForms = new JsonFormsElement();
  jsonForms.state = {
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
  };

  setTimeout(
    () => {
      jsonForms.connectedCallback();
      t.is(jsonForms.children.length, 1);
      t.is(jsonForms.children.item(0).className, 'root_properties_name');
      t.deepEqual(jsonForms.store.getState().common.schema.properties, t.context.schema.properties);
      t.is(jsonForms.store.getState().common.uischema, t.context.uischema);
      t.end();
    },
    100
  );
});

test.cb('render with data schema and UI schema set', t => {
  t.plan(3);
  const jsonForms = new JsonFormsElement();
  jsonForms.state = {
    data: undefined,
    schema: t.context.schema,
    uischema: t.context.uischema,
  };
  setTimeout(
    () => {
      jsonForms.connectedCallback();
      // label is rendered
      t.is(jsonForms.children.length, 1);
      t.deepEqual(jsonForms.store.getState().common.schema, t.context.schema);
      t.is(jsonForms.store.getState().common.uischema, t.context.uischema);
      t.end();
    },
    100
  );
});

test('Connect JSON Forms element and cause data change', t => {
  const jsonForms = new JsonFormsElement();
  jsonForms.state = {
    data: t.context.data,
  };
  jsonForms.connectedCallback();
  t.is(jsonForms.children.length, 1);

  const verticalLayout1 = jsonForms.children.item(0);
  t.is(verticalLayout1.className, 'layout');
  t.is(verticalLayout1.children.length, 1);

  jsonForms.state = {
    data: { lastname: 'foo', firstname: 'bar' },
  };
  t.is(jsonForms.children.length, 1);

  const verticalLayout2 = jsonForms.children.item(0);
  t.is(verticalLayout2.className, 'layout');
  t.is(verticalLayout2.children.length, 2);
});
