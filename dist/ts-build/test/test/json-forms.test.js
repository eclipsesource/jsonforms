"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
require("./helpers/setup");
const json_forms_1 = require("../src/json-forms");
const ui_schema_gen_1 = require("../src/generators/ui-schema-gen");
const schema_gen_1 = require("../src/generators/schema-gen");
const core_1 = require("../src/core");
ava_1.default.before(() => {
    core_1.JsonForms.stylingRegistry.register('vertical-layout', ['vertical-layout']);
});
ava_1.default.beforeEach(t => {
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
ava_1.default('render with data set', t => {
    const jsonForms = new json_forms_1.JsonFormsElement();
    const jsonSchema = schema_gen_1.generateJsonSchema({ name: 'foo' });
    jsonForms.data = t.context.data;
    jsonForms.connectedCallback();
    t.is(jsonForms.children.length, 1);
    t.is(jsonForms.children.item(0).className, 'vertical-layout');
    t.deepEqual(jsonForms.dataSchema, jsonSchema);
    t.deepEqual(jsonForms.uiSchema, ui_schema_gen_1.generateDefaultUISchema(jsonSchema));
});
ava_1.default('render with data and data schema set', t => {
    const jsonForms = new json_forms_1.JsonFormsElement();
    jsonForms.data = t.context.data;
    jsonForms.dataSchema = t.context.schema;
    jsonForms.connectedCallback();
    t.is(jsonForms.children.length, 0);
});
ava_1.default.cb('render with data and data schema set', t => {
    t.plan(4);
    const jsonForms = new json_forms_1.JsonFormsElement();
    jsonForms.data = t.context.data;
    jsonForms.dataSchema = t.context.schema;
    setTimeout(() => {
        jsonForms.connectedCallback();
        t.is(jsonForms.children.length, 1);
        t.is(jsonForms.children.item(0).className, 'vertical-layout');
        t.deepEqual(jsonForms.dataSchema.properties, t.context.schema.properties);
        t.deepEqual(jsonForms.uiSchema, ui_schema_gen_1.generateDefaultUISchema(t.context.schema));
        t.end();
    }, 100);
});
ava_1.default('render with data and UI schema set', t => {
    const jsonForms = new json_forms_1.JsonFormsElement();
    jsonForms.data = { name: 'foo' };
    const uischema = t.context.uischema;
    jsonForms.uiSchema = uischema;
    jsonForms.connectedCallback();
    t.is(jsonForms.children.length, 1);
    t.is(jsonForms.children.item(0).className, 'control root_properties_name valid');
    t.deepEqual(jsonForms.dataSchema, schema_gen_1.generateJsonSchema({ name: 'foo' }));
    t.is(jsonForms.uiSchema, uischema);
});
ava_1.default.cb('render with data, data schema and UI schema set', t => {
    t.plan(4);
    const jsonForms = new json_forms_1.JsonFormsElement();
    jsonForms.data = t.context.data;
    jsonForms.dataSchema = t.context.schema;
    jsonForms.uiSchema = t.context.uischema;
    setTimeout(() => {
        jsonForms.connectedCallback();
        t.is(jsonForms.children.length, 1);
        t.is(jsonForms.children.item(0).className, 'control root_properties_name valid');
        t.deepEqual(jsonForms.dataSchema.properties, t.context.schema.properties);
        t.is(jsonForms.uiSchema, t.context.uischema);
        t.end();
    }, 100);
});
ava_1.default.cb('render with data schema and UI schema set', t => {
    t.plan(3);
    const jsonForms = new json_forms_1.JsonFormsElement();
    jsonForms.dataSchema = t.context.schema;
    jsonForms.uiSchema = t.context.uischema;
    setTimeout(() => {
        jsonForms.connectedCallback();
        t.is(jsonForms.children.length, 0);
        t.deepEqual(jsonForms.dataSchema, t.context.schema);
        t.is(jsonForms.uiSchema, t.context.uischema);
        t.end();
    }, 100);
});
ava_1.default('Connect JSON Forms element and cause data change', t => {
    const jsonForms = new json_forms_1.JsonFormsElement();
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
//# sourceMappingURL=json-forms.test.js.map