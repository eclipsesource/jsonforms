/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import '@jsonforms/test';
import test from 'ava';
import {
  ControlElement,
  generateDefaultUISchema,
  generateJsonSchema,
  getSchema,
  getUiSchema,
  jsonformsReducer,
  JsonFormsState
} from '@jsonforms/core';
import { combineReducers, createStore } from 'redux';
import { FakeControl, fakeControlTester, FakeLayout, fakeLayoutTester } from '@jsonforms/test';
import { JsonFormsElement } from '../src/JsonFormsElement';

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
  t.context.renderers = [
    { tester: fakeControlTester, renderer: FakeControl },
    { tester: fakeLayoutTester, renderer: FakeLayout }
  ];
});

test.cb('render with data set', t => {
  const jsonForms = new JsonFormsElement();
  const jsonSchema = generateJsonSchema(t.context.data);
  jsonForms.store = createStore(
    combineReducers<JsonFormsState>({ jsonforms: jsonformsReducer() }),
    {
      jsonforms: {
        core: {
          data: t.context.data,
        },
        renderers: t.context.renderers
      }
    }
  );
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
  jsonForms.store = createStore(
    combineReducers<JsonFormsState>({ jsonforms: jsonformsReducer() }),
    {
      jsonforms: {
        core: {
          data: t.context.data,
          schema: t.context.schema
        },
        renderers: t.context.renderers
      }
    }
  );

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
  jsonForms.store = createStore(
    combineReducers<JsonFormsState>({ jsonforms: jsonformsReducer() }),
    {
      jsonforms: {
        core: {
          data: t.context.data,
          uischema: t.context.uischema
        },
        renderers: t.context.renderers
      }
    }
  );
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
  jsonForms.store = createStore(
    combineReducers<JsonFormsState>({ jsonforms: jsonformsReducer() }),
    {
      jsonforms: {
        core: {
          data: t.context.data,
          schema: t.context.schema,
          uischema: t.context.uischema
        },
        renderers: t.context.renderers
      }
    }
  );
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
  jsonForms.store = createStore(
    combineReducers<JsonFormsState>({ jsonforms: jsonformsReducer() }),
    {
      jsonforms: {
        core: {
          data: undefined,
          schema: t.context.schema,
          uischema: t.context.uischema
        },
        renderers: t.context.renderers
      }
    }
  );
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

test.cb('Connect JSON Forms element and cause re-init store', t => {
  t.plan(6);
  const jsonForms = new JsonFormsElement();
  jsonForms.store = createStore(
    combineReducers<JsonFormsState>({ jsonforms: jsonformsReducer() }),
    {
      jsonforms: {
        core: {
          data: t.context.data,
        },
        renderers: t.context.renderers
      }
    }
  );
  jsonForms.connectedCallback();

  setTimeout(
    () => {
      t.is(jsonForms.children.length, 1);
      const verticalLayout1 = jsonForms.children.item(0);
      t.is(verticalLayout1.className, 'layout');
      t.is(verticalLayout1.children.length, 1);

      jsonForms.store = createStore(
        combineReducers<JsonFormsState>({ jsonforms: jsonformsReducer() }),
        {
          jsonforms: {
            core: {
              data: {
                firstname: 'bar',
                lastname: 'foo'
              }
            },
            renderers: t.context.renderers
          }
        }
      );
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
