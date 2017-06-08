import test from 'ava';
// inject window, document etc.
declare var global;
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
installCE(global);
import {JsonSchema} from '../src/models/jsonSchema';
import {VerticalLayout, ControlElement} from '../src/models/uischema';
import {JsonFormsHolder} from '../src/core';
import {JsonForms} from '../src/json-forms';
import '../src/renderers/renderers';
import '../src/services/services';
import {generateDefaultUISchema} from '../src/generators/ui-schema-gen';
import {generateJsonSchema} from '../src/generators/schema-gen';

test.cb('jsonforms only data', t => {
  t.plan(4);
  const jsonForms = new JsonForms();
  jsonForms.data = {name: 'foo'};
  jsonForms.connectedCallback();
  setTimeout(() => {
    t.is(jsonForms.children.length, 1);
    t.is(jsonForms.children.item(0).tagName, 'JSONFORMS-VERTICALLAYOUT');
    const jsonSchema = generateJsonSchema({name: 'foo'});
    t.deepEqual(jsonForms.dataModel, {label: 'root', schema: jsonSchema, dropPoints: {},
      attributes: {
        name: {label: 'name', schema: jsonSchema.properties['name'], dropPoints: {}, attributes: {},
          type: 0}
    }, type: 0});
    t.deepEqual(jsonForms.uiSchema, generateDefaultUISchema(jsonSchema));
    t.end();
  }, 100);
});
test('jsonforms data and schema no render', t => {
  const jsonForms = new JsonForms();
  jsonForms.data = {name: 'foo'};
  const dataSchema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  jsonForms.dataSchema = dataSchema;
  jsonForms.connectedCallback();
  t.is(jsonForms.children.length, 0);
});
test.cb('jsonforms data and schema', t => {
    t.plan(4);
    const jsonForms = new JsonForms();
    jsonForms.data = {name: 'foo'};
    const dataSchema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
    jsonForms.dataSchema = dataSchema;
    jsonForms.connectedCallback();
    setTimeout(() => {
      t.is(jsonForms.children.length, 1);
      t.is(jsonForms.children.item(0).tagName, 'JSONFORMS-VERTICALLAYOUT');
      t.deepEqual(jsonForms.dataModel, {label: 'root', schema: dataSchema, dropPoints: {}, type: 0,
      attributes: {
        name: {
          label: 'name', schema: dataSchema.properties['name'], dropPoints: {},
            type: 0, attributes: {}
        }
      }});
      t.deepEqual(jsonForms.uiSchema, generateDefaultUISchema(dataSchema));
      t.end();
    }, 100);
});
test.cb('jsonforms data and uischema', t => {
    t.plan(4);
    const jsonForms = new JsonForms();
    jsonForms.data = {name: 'foo'};
    const uiSchema = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
    jsonForms.uiSchema = uiSchema;
    const dataSchema = generateJsonSchema({name: 'foo'});
    jsonForms.connectedCallback();
    setTimeout(() => {
    t.is(jsonForms.children.length, 1);
    t.is(jsonForms.children.item(0).tagName, 'JSONFORMS-TEXT');
    t.deepEqual(jsonForms.dataModel, {label: 'root', schema: dataSchema, dropPoints: {}, type: 0,
    attributes: {
      name: {
        label: 'name', schema: dataSchema.properties['name'], dropPoints: {},
          type: 0, attributes: {}
      }
    }});
    t.is(jsonForms.uiSchema, uiSchema);
    t.end();
  }, 100);
});
test.cb('jsonforms data, schema and uischema', t => {
    t.plan(4);
    const jsonForms = new JsonForms();
    jsonForms.data = {name: 'foo'};
    const dataSchema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
    jsonForms.dataSchema = dataSchema;
    const uiSchema = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
    jsonForms.uiSchema = uiSchema;
    jsonForms.connectedCallback();
    setTimeout(() => {
      t.is(jsonForms.children.length, 1);
      t.is(jsonForms.children.item(0).tagName, 'JSONFORMS-TEXT');
      t.deepEqual(jsonForms.dataModel,
        {label: 'root', schema: dataSchema, dropPoints: {}, attributes: {
          name: {label: 'name', schema: dataSchema.properties['name'], dropPoints: {},
            attributes: {}, type: 0}
        }, type: 0});
      t.is(jsonForms.uiSchema, uiSchema);
      t.end();
    }, 100);
});
test.cb('jsonforms schema and uischema', t => {
    t.plan(3);
    const jsonForms = new JsonForms();
    const dataSchema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
    jsonForms.dataSchema = dataSchema;
    const uiSchema = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
    jsonForms.uiSchema = uiSchema;
    jsonForms.connectedCallback();
    setTimeout(() => {
      t.is(jsonForms.children.length, 0);
      t.deepEqual(jsonForms.dataModel,
      {label: 'root', schema: dataSchema, dropPoints: {}, attributes: {
        name: {label: 'name', schema: dataSchema.properties['name'], dropPoints: {},
          attributes: {}, type: 0}
      }, type: 0});
      t.is(jsonForms.uiSchema, uiSchema);
      t.end();
    }, 100);
});
test.cb('jsonforms data change', t => {
  t.plan(10);
  const jsonForms = new JsonForms();
  jsonForms.data = {name: 'foo'};
  t.is(jsonForms['dataService']['changeListeners'].length, 0);
  jsonForms.connectedCallback();
  setTimeout(() => {
    // as the renderers are not connected no change listeners are attached
    t.is(jsonForms['dataService']['changeListeners'].length, 2);
    t.is(jsonForms.children.length, 1);
    {
      const verticalLayout = jsonForms.children.item(0);
      t.is(verticalLayout.tagName, 'JSONFORMS-VERTICALLAYOUT');
      verticalLayout['connectedCallback']();
      t.is(verticalLayout.children[0].children.length, 1);
    }
    jsonForms.data = {lastname: 'foo', fristname: 'bar'};
    setTimeout(() => {
      // as the renderers are not connected no change listeners are attached
      t.is(jsonForms['dataService']['changeListeners'].length, 2);
      t.is(jsonForms.children.length, 1);
      const verticalLayout2 = jsonForms.children.item(0);
      t.is(verticalLayout2.tagName, 'JSONFORMS-VERTICALLAYOUT');
      verticalLayout2['connectedCallback']();
        t.is(verticalLayout2.children[0].children.length, 2);
        jsonForms.disconnectedCallback();
        t.is(jsonForms['dataService']['changeListeners'].length, 0);
        t.end();
      }, 100);
  }, 100);
});
