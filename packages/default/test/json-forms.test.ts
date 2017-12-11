import './helpers/setup';
import test from 'ava';
import { JsonFormsElement } from 'jsonforms-core';
import '../src/index';
import { ControlElement, generateDefaultUISchema, generateJsonSchema } from 'jsonforms-core';

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

test('render with data set', t => {
  const jsonForms = new JsonFormsElement();
  const jsonSchema = generateJsonSchema({ name: 'foo' });

  jsonForms.data = t.context.data;
  jsonForms.connectedCallback();

  t.is(jsonForms.children.length, 1);
  t.is(jsonForms.children.item(0).className, 'vertical-layout');
  t.deepEqual(jsonForms.dataSchema, jsonSchema);
  t.deepEqual(jsonForms.uiSchema, generateDefaultUISchema(jsonSchema));
});

test('render with data and data schema set', t => {
  const jsonForms = new JsonFormsElement();
  jsonForms.data = t.context.data;
  jsonForms.dataSchema = t.context.schema;
  jsonForms.connectedCallback();
  t.is(jsonForms.children.length, 0);
});

test.cb('render with data and data schema set', t => {
  t.plan(4);
  const jsonForms = new JsonFormsElement();
  jsonForms.data = t.context.data;
  jsonForms.dataSchema = t.context.schema;
  setTimeout(
    () => {
      jsonForms.connectedCallback();
      t.is(jsonForms.children.length, 1);
      t.is(jsonForms.children.item(0).className, 'vertical-layout');
      t.deepEqual(jsonForms.dataSchema.properties, t.context.schema.properties);
      t.deepEqual(jsonForms.uiSchema, generateDefaultUISchema(t.context.schema));
      t.end();
    },
    100
  );
});

test('render with data and UI schema set', t => {
  const jsonForms = new JsonFormsElement();
  jsonForms.data = { name: 'foo' };
  const uischema: ControlElement = t.context.uischema;
  jsonForms.uiSchema = uischema;
  jsonForms.connectedCallback();
  t.is(jsonForms.children.length, 1);
  t.is(jsonForms.children.item(0).className, 'control root_properties_name');
  t.deepEqual(jsonForms.dataSchema, generateJsonSchema({ name: 'foo' }));
  t.is(jsonForms.uiSchema, uischema);
});

test.cb('render with data, data schema and UI schema set', t => {
  t.plan(4);
  const jsonForms = new JsonFormsElement();
  jsonForms.data = t.context.data;
  jsonForms.dataSchema = t.context.schema;
  jsonForms.uiSchema = t.context.uischema;

  setTimeout(
    () => {
      jsonForms.connectedCallback();
      t.is(jsonForms.children.length, 1);
      t.is(jsonForms.children.item(0).className, 'control root_properties_name');
      t.deepEqual(jsonForms.dataSchema.properties, t.context.schema.properties);
      t.is(jsonForms.uiSchema, t.context.uischema);
      t.end();
    },
    100
  );
});

test.cb('render with data schema and UI schema set', t => {
  t.plan(3);
  const jsonForms = new JsonFormsElement();
  jsonForms.dataSchema = t.context.schema;
  jsonForms.uiSchema = t.context.uischema;
  setTimeout(
    () => {
      jsonForms.connectedCallback();
      t.is(jsonForms.children.length, 0);
      t.deepEqual(jsonForms.dataSchema, t.context.schema);
      t.is(jsonForms.uiSchema, t.context.uischema);
      t.end();
    },
    100
  );
});

test('Connect JSON Forms element and cause data change', t => {
  const jsonForms = new JsonFormsElement();
  jsonForms.data = { name: 'foo' };
  jsonForms.connectedCallback();
  t.is(jsonForms.children.length, 1);

  const verticalLayout1 = jsonForms.children.item(0);
  t.is(verticalLayout1.className, 'vertical-layout');
  t.is(verticalLayout1.children[0].children.length, 1);

  jsonForms.data = { lastname: 'foo', fristname: 'bar' };
  t.is(jsonForms.children.length, 1);

  const verticalLayout2 = jsonForms.children.item(0);
  t.is(verticalLayout2.className, 'vertical-layout');
  t.is(verticalLayout2.children.length, 2);
});
