"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
require("./helpers/setup");
const json_forms_1 = require("../src/json-forms");
require("../src/renderers/renderers");
require("../src/services/services");
const ui_schema_gen_1 = require("../src/generators/ui-schema-gen");
const schema_gen_1 = require("../src/generators/schema-gen");
ava_1.default('Connect JSON Forms element with data only', t => {
    const jsonForms = new json_forms_1.JsonFormsElement();
    jsonForms.data = { name: 'foo' };
    jsonForms.connectedCallback();
    t.is(jsonForms.children.length, 1);
    t.is(jsonForms.children.item(0).tagName, 'JSONFORMS-VERTICALLAYOUT');
    const jsonSchema = schema_gen_1.generateJsonSchema({ name: 'foo' });
    t.deepEqual(jsonForms.dataSchema, jsonSchema);
    t.deepEqual(jsonForms.uiSchema, ui_schema_gen_1.generateDefaultUISchema(jsonSchema));
});
ava_1.default('Connect JSON Forms element with data and data schema set', t => {
    const jsonForms = new json_forms_1.JsonFormsElement();
    jsonForms.data = { name: 'foo' };
    jsonForms.dataSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    jsonForms.connectedCallback();
    t.is(jsonForms.children.length, 0);
});
ava_1.default.cb('Connect JSON Forms element with data and data schema set', t => {
    t.plan(4);
    const jsonForms = new json_forms_1.JsonFormsElement();
    jsonForms.data = { name: 'foo' };
    const dataSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    jsonForms.dataSchema = dataSchema;
    setTimeout(() => {
        jsonForms.connectedCallback();
        t.is(jsonForms.children.length, 1);
        t.is(jsonForms.children.item(0).tagName, 'JSONFORMS-VERTICALLAYOUT');
        t.deepEqual(jsonForms.dataSchema.properties, dataSchema.properties);
        t.deepEqual(jsonForms.uiSchema, ui_schema_gen_1.generateDefaultUISchema(dataSchema));
        t.end();
    }, 100);
});
ava_1.default('Connect JSON Forms element with data and UI schema set', t => {
    const jsonForms = new json_forms_1.JsonFormsElement();
    jsonForms.data = { name: 'foo' };
    const uiSchema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/name'
        }
    };
    jsonForms.uiSchema = uiSchema;
    jsonForms.connectedCallback();
    t.is(jsonForms.children.length, 1);
    t.is(jsonForms.children.item(0).tagName, 'JSONFORMS-TEXT');
    t.deepEqual(jsonForms.dataSchema, schema_gen_1.generateJsonSchema({ name: 'foo' }));
    t.is(jsonForms.uiSchema, uiSchema);
});
ava_1.default.cb('Connect JSON Forms element with data, data and UI schema set', t => {
    t.plan(4);
    const jsonForms = new json_forms_1.JsonFormsElement();
    jsonForms.data = { name: 'foo' };
    const dataSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    jsonForms.dataSchema = dataSchema;
    const uiSchema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/name'
        }
    };
    jsonForms.uiSchema = uiSchema;
    setTimeout(() => {
        jsonForms.connectedCallback();
        t.is(jsonForms.children.length, 1);
        t.is(jsonForms.children.item(0).tagName, 'JSONFORMS-TEXT');
        t.deepEqual(jsonForms.dataSchema.properties, dataSchema.properties);
        t.is(jsonForms.uiSchema, uiSchema);
        t.end();
    }, 100);
});
ava_1.default.cb('Connect JSON Forms element with data and UI schema set', t => {
    t.plan(3);
    const jsonForms = new json_forms_1.JsonFormsElement();
    const dataSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const uiSchema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/name'
        }
    };
    jsonForms.dataSchema = dataSchema;
    jsonForms.uiSchema = uiSchema;
    setTimeout(() => {
        jsonForms.connectedCallback();
        t.is(jsonForms.children.length, 0);
        t.deepEqual(jsonForms.dataSchema, dataSchema);
        t.is(jsonForms.uiSchema, uiSchema);
        t.end();
    }, 100);
});
ava_1.default('Connect JSON Forms element and cause data change', t => {
    const jsonForms = new json_forms_1.JsonFormsElement();
    jsonForms.data = { name: 'foo' };
    // TODO: fix warnings
    /*tslint:disable:no-string-literal */
    t.is(jsonForms['dataService']['dataChangeListeners'].length, 0);
    /*tslint:enable:no-string-literal */
    jsonForms.connectedCallback();
    // as the renderers are not connected no change listeners are attached
    /*tslint:disable:no-string-literal */
    t.is(jsonForms['dataService']['dataChangeListeners'].length, 2);
    /*tslint:enable:no-string-literal */
    t.is(jsonForms.children.length, 1);
    {
        const verticalLayout = jsonForms.children.item(0);
        t.is(verticalLayout.tagName, 'JSONFORMS-VERTICALLAYOUT');
        /*tslint:disable:no-string-literal */
        verticalLayout['connectedCallback']();
        /*tslint:enable:no-string-literal */
        t.is(verticalLayout.children[0].children.length, 1);
    }
    jsonForms.data = { lastname: 'foo', fristname: 'bar' };
    // as the renderers are not connected no change listeners are attached
    /*tslint:disable:no-string-literal */
    t.is(jsonForms['dataService']['dataChangeListeners'].length, 2);
    /*tslint:enable:no-string-literal */
    t.is(jsonForms.children.length, 1);
    {
        const verticalLayout = jsonForms.children.item(0);
        t.is(verticalLayout.tagName, 'JSONFORMS-VERTICALLAYOUT');
        /*tslint:disable:no-string-literal */
        verticalLayout['connectedCallback']();
        /*tslint:enable:no-string-literal */
        t.is(verticalLayout.children[0].children.length, 2);
    }
    jsonForms.disconnectedCallback();
    /*tslint:disable:no-string-literal */
    t.is(jsonForms['dataService']['dataChangeListeners'].length, 0);
});
//# sourceMappingURL=json-forms.test.js.map