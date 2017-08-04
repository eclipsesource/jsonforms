"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const installCE = require("document-register-element/pony");
// inject window, document etc.
require("jsdom-global/register");
installCE(global, 'force');
const data_service_1 = require("../../src/core/data.service");
const integer_control_1 = require("../../src/renderers/controls/integer.control");
const core_1 = require("../../src/core");
const base_control_tests_1 = require("./base.control.tests");
ava_1.default.before(t => {
    core_1.JsonForms.stylingRegistry.registerMany([
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
ava_1.default.beforeEach(t => {
    t.context.data = { 'foo': 42 };
    t.context.schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'integer',
            },
        },
    };
    t.context.uiSchema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo',
        },
    };
});
ava_1.default('IntegerControlTester', t => {
    t.is(integer_control_1.integerControlTester(undefined, undefined), -1);
    t.is(integer_control_1.integerControlTester(null, undefined), -1);
    t.is(integer_control_1.integerControlTester({ type: 'Foo' }, undefined), -1);
    t.is(integer_control_1.integerControlTester({ type: 'Control' }, undefined), -1);
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.is(integer_control_1.integerControlTester(controlElement, { type: 'object', properties: { foo: { type: 'string' } } }), -1);
    t.is(integer_control_1.integerControlTester(controlElement, { type: 'object', properties: { foo: { type: 'string' }, bar: { type: 'integer' } } }), -1);
    t.is(integer_control_1.integerControlTester(controlElement, { type: 'object', properties: { foo: { type: 'integer' } } }), 2);
});
ava_1.default('IntegerControl static', t => {
    const renderer = new integer_control_1.IntegerControl();
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    const result = renderer.render();
    const className = result.className;
    t.true(className.indexOf('root_properties_foo') !== -1);
    t.true(className.indexOf('control') !== -1);
    t.is(result.childNodes.length, 3);
    const label = result.children[0];
    t.is(label.tagName, 'LABEL');
    t.is(label.textContent, 'Foo');
    const input = result.children[1];
    t.is(input.tagName, 'INPUT');
    t.is(input.type, 'number');
    t.is(input.step, '1');
    t.is(input.valueAsNumber, 42);
    const validation = result.children[2];
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('IntegerControl static no label', t => {
    const renderer = new integer_control_1.IntegerControl();
    const data = { 'foo': 13 };
    const uiSchema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: false
    };
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    const className = result.className;
    t.true(className.indexOf('control') !== -1);
    t.is(result.childNodes.length, 3);
    const label = result.children[0];
    t.is(label.tagName, 'LABEL');
    t.is(label.textContent, '');
    const input = result.children[1];
    t.is(input.tagName, 'INPUT');
    t.is(input.type, 'number');
    t.is(input.step, '1');
    t.is(input.valueAsNumber, 13);
    const validation = result.children[2];
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('IntegerControl inputChange', t => {
    const renderer = new integer_control_1.IntegerControl();
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    const result = renderer.render();
    const input = result.children[1];
    input.valueAsNumber = 13;
    input.oninput(null);
    t.is(t.context.data.foo, 13);
});
ava_1.default('IntegerControl dataService notification', t => {
    const renderer = new integer_control_1.IntegerControl();
    const data = { 'foo': 13 };
    const dataService = new data_service_1.DataService(data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/foo' } }, 42);
    t.is(input.valueAsNumber, 42);
});
ava_1.default('IntegerControl dataService notification value undefined', t => {
    const renderer = new integer_control_1.IntegerControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({
        scope: {
            $ref: '#/properties/foo'
        }
    }, undefined);
    t.is(input.valueAsNumber, undefined);
});
ava_1.default('IntegerControl dataService notification value null', t => {
    const renderer = new integer_control_1.IntegerControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/foo' } }, null);
    t.is(input.valueAsNumber, undefined);
});
ava_1.default('IntegerControl dataService notification wrong ref', t => {
    const renderer = new integer_control_1.IntegerControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/bar' } }, 'Bar');
    t.is(input.valueAsNumber, 42);
});
ava_1.default('IntegerControl dataService notification null ref', t => {
    const renderer = new integer_control_1.IntegerControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(null, 13);
    t.is(input.valueAsNumber, 42);
});
ava_1.default('IntegerControl dataService notification undefined ref', t => {
    const renderer = new integer_control_1.IntegerControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(undefined, 13);
    t.is(input.valueAsNumber, 42);
});
ava_1.default('IntegerControl dataService no notification after disconnect', t => {
    const renderer = new integer_control_1.IntegerControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/foo' } }, 'Bar');
    t.is(input.valueAsNumber, 42);
});
ava_1.default('Integer control notify visible false', t => {
    base_control_tests_1.testHide(t, new integer_control_1.IntegerControl());
});
ava_1.default('Integer control notify visible true', t => {
    base_control_tests_1.testShow(t, new integer_control_1.IntegerControl());
});
ava_1.default('Integer control notify disabled', t => {
    base_control_tests_1.testDisable(t, new integer_control_1.IntegerControl());
});
ava_1.default('Integer control notify enabled', t => {
    base_control_tests_1.testEnable(t, new integer_control_1.IntegerControl());
});
ava_1.default('Integer control notify one error', t => {
    base_control_tests_1.testOneError(t, new integer_control_1.IntegerControl());
});
ava_1.default('Integer control notify multiple errors', t => {
    base_control_tests_1.testMultipleErrors(t, new integer_control_1.IntegerControl());
});
ava_1.default('Integer control notify errors undefined', t => {
    base_control_tests_1.testUndefinedErrors(t, new integer_control_1.IntegerControl());
});
ava_1.default('Integer control notify errors null', t => {
    base_control_tests_1.testNullErrors(t, new integer_control_1.IntegerControl());
});
ava_1.default('Integer control notify errors clean', t => {
    base_control_tests_1.testResetErrors(t, new integer_control_1.IntegerControl());
});
ava_1.default('Integer control disconnected no notify visible', t => {
    base_control_tests_1.testNotifyAboutVisibiltyWhenDisconnected(t, new integer_control_1.IntegerControl());
});
ava_1.default('Integer control disconnected no notify enabled', t => {
    base_control_tests_1.testNotifyAboutEnablementWhenDisconnected(t, new integer_control_1.IntegerControl());
});
ava_1.default('Integer control disconnected no notify error', t => {
    base_control_tests_1.testNotifyAboutValidationWhenDisconnected(t, new integer_control_1.IntegerControl());
});
//# sourceMappingURL=integer.control.test.js.map