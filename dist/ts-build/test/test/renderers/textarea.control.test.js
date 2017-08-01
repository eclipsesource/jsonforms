"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const installCE = require("document-register-element/pony");
// inject window, document etc.
require("jsdom-global/register");
installCE(global, 'force');
const data_service_1 = require("../../src/core/data.service");
const textarea_control_1 = require("../../src/renderers/controls/textarea.control");
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
ava_1.default('TextAreaControlTester', t => {
    t.is(textarea_control_1.textAreaControlTester(undefined, undefined), -1);
    t.is(textarea_control_1.textAreaControlTester(null, undefined), -1);
    t.is(textarea_control_1.textAreaControlTester({ type: 'Foo' }, undefined), -1);
    t.is(textarea_control_1.textAreaControlTester({ type: 'Control' }, undefined), -1);
    t.is(textarea_control_1.textAreaControlTester({ type: 'Control', options: { multi: true } }, undefined), 2);
});
ava_1.default('TextAreaControl static', t => {
    const renderer = new textarea_control_1.TextAreaControl();
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    const result = renderer.render();
    const className = result.className;
    t.true(className.indexOf('root_properties_name') !== -1);
    t.true(className.indexOf('control') !== -1);
    t.is(result.childNodes.length, 3);
    const label = result.children[0];
    t.is(label.tagName, 'LABEL');
    t.is(label.textContent, 'Name');
    const input = result.children[1];
    t.is(input.tagName, 'TEXTAREA');
    t.is(input.value, 'Foo');
    const validation = result.children[2];
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('TextAreaControl static no label', t => {
    const uiSchemaWithoutLabel = {
        type: 'Control',
        scope: {
            $ref: '#/properties/name'
        },
        label: false
    };
    const renderer = new textarea_control_1.TextAreaControl();
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(uiSchemaWithoutLabel);
    const result = renderer.render();
    const className = result.className;
    t.true(className.indexOf('control') !== -1);
    t.is(result.childNodes.length, 3);
    const label = result.children[0];
    t.is(label.tagName, 'LABEL');
    t.is(label.textContent, '');
    const input = result.children[1];
    t.is(input.tagName, 'TEXTAREA');
    t.is(input.value, 'Foo');
    const validation = result.children[2];
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('TextAreaControl inputChange', t => {
    const renderer = new textarea_control_1.TextAreaControl();
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    const result = renderer.render();
    const input = result.children[1];
    input.value = 'Bar';
    input.oninput(null);
    t.is(t.context.data.name, 'Bar');
});
ava_1.default('TextAreaControl dataService notification', t => {
    const renderer = new textarea_control_1.TextAreaControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/name' } }, 'Bar');
    t.is(input.value, 'Bar');
});
ava_1.default('TextAreaControl dataService notification value undefined', t => {
    const renderer = new textarea_control_1.TextAreaControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({
        scope: {
            $ref: '#/properties/name'
        }
    }, undefined);
    t.is(input.value, '');
});
ava_1.default('TextAreaControl dataService notification value null', t => {
    const renderer = new textarea_control_1.TextAreaControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/name' } }, null);
    t.is(input.value, '');
});
ava_1.default('TextAreaControl dataService notification wrong ref', t => {
    const renderer = new textarea_control_1.TextAreaControl();
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
ava_1.default('TextAreaControl dataService notification null ref', t => {
    const renderer = new textarea_control_1.TextAreaControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(null, 'Bar');
    t.is(input.value, 'Foo');
});
ava_1.default('TextAreaControl dataService notification undefined ref', t => {
    const renderer = new textarea_control_1.TextAreaControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(undefined, 'Bar');
    t.is(input.value, 'Foo');
});
ava_1.default('TextAreaControl dataService no notification after disconnect', t => {
    const renderer = new textarea_control_1.TextAreaControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/name' } }, 'Bar');
    t.is(input.value, 'Foo');
});
ava_1.default('TextAreaControl notify visible false', t => {
    base_control_tests_1.testHide(t, new textarea_control_1.TextAreaControl());
});
ava_1.default('TextAreaControl notify visible true', t => {
    base_control_tests_1.testShow(t, new textarea_control_1.TextAreaControl());
});
ava_1.default('TextAreaControl notify disabled', t => {
    base_control_tests_1.testDisable(t, new textarea_control_1.TextAreaControl());
});
ava_1.default('TextAreaControl notify enabled', t => {
    base_control_tests_1.testEnable(t, new textarea_control_1.TextAreaControl());
});
ava_1.default('TextAreaControl notify one error', t => {
    base_control_tests_1.testOneError(t, new textarea_control_1.TextAreaControl());
});
ava_1.default('TextAreaControl notify multiple errors', t => {
    base_control_tests_1.testMultipleErrors(t, new textarea_control_1.TextAreaControl());
});
ava_1.default('TextAreaControl notify errors undefined', t => {
    base_control_tests_1.testUndefinedErrors(t, new textarea_control_1.TextAreaControl());
});
ava_1.default('TextAreaControl notify errors null', t => {
    base_control_tests_1.testNullErrors(t, new textarea_control_1.TextAreaControl());
});
ava_1.default('TextAreaControl notify errors clean', t => {
    base_control_tests_1.testResetErrors(t, new textarea_control_1.TextAreaControl());
});
ava_1.default('TextAreaControl disconnected no notify visible', t => {
    base_control_tests_1.testNotifyAboutVisibiltyWhenDisconnected(t, new textarea_control_1.TextAreaControl());
});
ava_1.default('TextAreaControl disconnected no notify enabled', t => {
    base_control_tests_1.testNotifyAboutEnablementWhenDisconnected(t, new textarea_control_1.TextAreaControl());
});
ava_1.default('TextAreaControl disconnected no notify error', t => {
    base_control_tests_1.testNotifyAboutValidationWhenDisconnected(t, new textarea_control_1.TextAreaControl());
});
//# sourceMappingURL=textarea.control.test.js.map