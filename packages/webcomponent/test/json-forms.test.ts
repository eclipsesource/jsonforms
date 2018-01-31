import '@jsonforms/test';
import test from 'ava';
import { JsonFormsElement } from '../src/json-forms';
import './FakeControl';
import './FakeLayout';
import {
  ControlElement,
  generateDefaultUISchema,
  generateJsonSchema,
  getSchema,
  getUiSchema,
} from '@jsonforms/core';

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
    scope: '#/properties/name'
  };
  t.context.translations = {
    'en-US': {
      name: 'foo'
    },
    'de-DE': {
      name: 'bar'
    }
  };
  t.context.locale = 'de-DE';
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
      t.deepEqual(getSchema(jsonForms.store.getState()), jsonSchema);
      t.deepEqual(getUiSchema(jsonForms.store.getState()), generateDefaultUISchema(jsonSchema));
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
      t.deepEqual(
        getSchema(jsonForms.store.getState()).properties,
        t.context.schema.properties
      );
      t.deepEqual(
        getUiSchema(jsonForms.store.getState()),
        generateDefaultUISchema(t.context.schema)
      );
      t.end();
    },
    100
  );
});

test.cb('render with data and UI schema set', t => {
  t.plan(4);
  const jsonForms = new JsonFormsElement();
  const uischema: ControlElement = t.context.uischema;
  jsonForms.state = {
    data: t.context.data,
    uischema: t.context.uischema,
  };
  jsonForms.connectedCallback();
  setTimeout(
    () => {
      t.is(jsonForms.children.length, 1);
      t.is(jsonForms.children.item(0).className, 'root_properties_name');
      t.deepEqual(getSchema(jsonForms.store.getState()), generateJsonSchema({ name: 'foo' }));
      t.is(getUiSchema(jsonForms.store.getState()), uischema);
      t.end();
    },
    100
  );
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
      t.deepEqual(getSchema(jsonForms.store.getState()).properties, t.context.schema.properties);
      t.is(getUiSchema(jsonForms.store.getState()), t.context.uischema);
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
      t.deepEqual(getSchema(jsonForms.store.getState()), t.context.schema);
      t.is(getUiSchema(jsonForms.store.getState()), t.context.uischema);
      t.end();
    },
    100
  );
});

test.cb('Connect JSON Forms element and cause data change', t => {
  t.plan(6);
  const jsonForms = new JsonFormsElement();
  jsonForms.state = {
    data: t.context.data,
  };
  jsonForms.connectedCallback();

  setTimeout(
    () => {
      t.is(jsonForms.children.length, 1);
      const verticalLayout1 = jsonForms.children.item(0);
      t.is(verticalLayout1.className, 'layout');
      t.is(verticalLayout1.children.length, 1);

      jsonForms.state = {
        data: {
          firstname: 'bar',
          lastname: 'foo'
        },
      };
      setTimeout(
        () => {
          t.is(jsonForms.children.length, 1);
          const verticalLayout2 = jsonForms.children.item(0);
          t.is(verticalLayout2.className, 'layout');
          t.is(verticalLayout2.children.length, 2);
          t.end();
        },
        100
      );
    },
    100
  );
});

test.cb('render with data and translation object', t => {
  t.plan(4);
  const jsonForms = new JsonFormsElement();
  jsonForms.state = {
    data: t.context.data,
    translations: t.context.translations
  };

  setTimeout(
    () => {
      jsonForms.connectedCallback();
      t.is(jsonForms.children.length, 1);
      t.is(jsonForms.children.item(0).className, 'layout');
      t.deepEqual(jsonForms.store.getState().jsonforms.i18n.translations, t.context.translations);
      t.is(jsonForms.store.getState().jsonforms.i18n.locale, navigator.languages[0]);
      t.end();
    },
    100
  );
});

test.cb('render with data,translation object and locale value', t => {
  t.plan(4);
  const jsonForms = new JsonFormsElement();
  jsonForms.state = {
    data: t.context.data,
    translations: t.context.translations,
    locale: t.context.locale
  };

  setTimeout(
    () => {
      jsonForms.connectedCallback();
      t.is(jsonForms.children.length, 1);
      t.is(jsonForms.children.item(0).className, 'layout');
      t.deepEqual(jsonForms.store.getState().jsonforms.i18n.translations, t.context.translations);
      t.is(jsonForms.store.getState().jsonforms.i18n.locale, t.context.locale);
      t.end();
    },
    100
  );
});