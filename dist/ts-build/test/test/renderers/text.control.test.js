"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const installCE = require("document-register-element/pony");
// inject window, document etc.
require("jsdom-global/register");
installCE(global, 'force');
const data_service_1 = require("../../src/core/data.service");
const text_control_1 = require("../../src/renderers/controls/text.control");
const base_control_tests_1 = require("./base.control.tests");
ava_1.default.beforeEach(t => {
    t.context.data = { 'name': 'Foo' };
    t.context.schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    t.context.uiSchema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/name'
        }
    };
});
ava_1.default('TextControlTester', t => {
    t.is(text_control_1.textControlTester(undefined, undefined), -1);
    t.is(text_control_1.textControlTester(null, undefined), -1);
    t.is(text_control_1.textControlTester({ type: 'Foo' }, undefined), -1);
    t.is(text_control_1.textControlTester({ type: 'Control' }, undefined), 1);
});
ava_1.default('TextControl static', t => {
    const schema = { type: 'object', properties: { name: { type: 'string' } } };
    const renderer = new text_control_1.TextControl();
    const data = { 'name': 'Foo' };
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(t.context.uiSchema);
    const result = renderer.render();
    t.is(result.className, 'control');
    t.is(result.childNodes.length, 3);
    const label = result.children[0];
    t.is(label.tagName, 'LABEL');
    t.is(label.textContent, 'Name');
    const input = result.children[1];
    t.is(input.tagName, 'INPUT');
    t.is(input.type, 'text');
    t.is(input.value, 'Foo');
    const validation = result.children[2];
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('TextControl static no label', t => {
    const renderer = new text_control_1.TextControl();
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    const controlWithLabel = {
        type: 'Control',
        scope: {
            $ref: '#/properties/name'
        },
        label: false
    };
    renderer.setUiSchema(controlWithLabel);
    const result = renderer.render();
    t.is(result.className, 'control');
    t.is(result.childNodes.length, 3);
    const label = result.children[0];
    t.is(label.tagName, 'LABEL');
    t.is(label.textContent, '');
    const input = result.children[1];
    t.is(input.tagName, 'INPUT');
    t.is(input.type, 'text');
    t.is(input.value, 'Foo');
    const validation = result.children[2];
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('TextControl inputChange', t => {
    const renderer = new text_control_1.TextControl();
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    const result = renderer.render();
    const input = result.children[1];
    input.value = 'Bar';
    input.oninput(null);
    t.is(t.context.data.name, 'Bar');
});
ava_1.default('TextControl dataService notification', t => {
    const renderer = new text_control_1.TextControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/name' } }, 'Bar');
    t.is(input.value, 'Bar');
});
ava_1.default('TextControl dataService notification value undefined', t => {
    const renderer = new text_control_1.TextControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(t.context.uiSchema, undefined);
    t.is(input.value, '');
});
ava_1.default('TextControl dataService notification value null', t => {
    const renderer = new text_control_1.TextControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/name' } }, null);
    t.is(input.value, '');
});
ava_1.default('TextControl dataService notification wrong ref', t => {
    const renderer = new text_control_1.TextControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    const differentControl = {
        type: 'Control',
        scope: {
            $ref: '#/properties/firstname'
        }
    };
    dataService.notifyAboutDataChange(differentControl, 'Bar');
    t.is(input.value, 'Foo');
});
ava_1.default('TextControl dataService notification null ref', t => {
    const renderer = new text_control_1.TextControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(null, 'Bar');
    t.is(input.value, 'Foo');
});
ava_1.default('TextControl dataService notification undefined ref', t => {
    const renderer = new text_control_1.TextControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(undefined, 'Bar');
    t.is(input.value, 'Foo');
});
ava_1.default('TextControl dataService no notification after disconnect', t => {
    const renderer = new text_control_1.TextControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(t.context.uiSchema, 'Bar');
    t.is(input.value, 'Foo');
});
ava_1.default('TextControl notify visible false', t => {
    base_control_tests_1.testHide(t, new text_control_1.TextControl());
});
ava_1.default('TextControl notify visible true', t => {
    base_control_tests_1.testShow(t, new text_control_1.TextControl());
});
ava_1.default('TextControl notify disabled', t => {
    base_control_tests_1.testDisable(t, new text_control_1.TextControl());
});
ava_1.default('TextControl notify enabled', t => {
    base_control_tests_1.testEnable(t, new text_control_1.TextControl());
});
ava_1.default('TextControl notify one error', t => {
    base_control_tests_1.testOneError(t, new text_control_1.TextControl());
});
ava_1.default('TextControl notify multiple errors', t => {
    base_control_tests_1.testMultipleErrors(t, new text_control_1.TextControl());
});
ava_1.default('TextControl notify errors undefined', t => {
    base_control_tests_1.testUndefinedErrors(t, new text_control_1.TextControl());
});
ava_1.default('TextControl notify errors null', t => {
    base_control_tests_1.testNullErrors(t, new text_control_1.TextControl());
});
ava_1.default('TextControl notify errors clean', t => {
    base_control_tests_1.testResetErrors(t, new text_control_1.TextControl());
});
ava_1.default('TextControl disconnected no notify visible', t => {
    base_control_tests_1.testNotifyAboutVisibiltyWhenDisconnected(t, new text_control_1.TextControl());
});
ava_1.default('TextControl disconnected no notify enabled', t => {
    base_control_tests_1.testNotifyAboutEnablementWhenDisconnected(t, new text_control_1.TextControl());
});
ava_1.default('TextControl disconnected no notify error', t => {
    base_control_tests_1.testNotifyAboutValidationWhenDisconnected(t, new text_control_1.TextControl());
});
//# sourceMappingURL=text.control.test.js.map