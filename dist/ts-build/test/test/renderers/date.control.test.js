"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const installCE = require("document-register-element/pony");
// inject window, document etc.
require("jsdom-global/register");
installCE(global, 'force');
const data_service_1 = require("../../src/core/data.service");
const date_control_1 = require("../../src/renderers/controls/date.control");
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
    t.context.data = { 'foo': '1980-04-04' };
    t.context.schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'date',
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
ava_1.default('DateControlTester', t => {
    t.is(date_control_1.dateControlTester(undefined, undefined), -1);
    t.is(date_control_1.dateControlTester(null, undefined), -1);
    t.is(date_control_1.dateControlTester({ type: 'Foo' }, undefined), -1);
    t.is(date_control_1.dateControlTester({ type: 'Control' }, undefined), -1);
});
ava_1.default('DateControl tester with wrong prop type', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo',
        }
    };
    t.is(date_control_1.dateControlTester(control, {
        type: 'object',
        properties: {
            foo: { type: 'string' },
        },
    }), -1);
});
ava_1.default('DateControl tester with wrong prop type, but sibling has correct one', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo',
        },
    };
    t.is(date_control_1.dateControlTester(control, {
        type: 'object',
        properties: {
            foo: { type: 'string' },
            bar: {
                type: 'string',
                format: 'date',
            },
        },
    }), -1);
});
ava_1.default('DateControl tester with correct prop type', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo',
        },
    };
    t.is(date_control_1.dateControlTester(control, {
        type: 'object',
        properties: {
            foo: {
                type: 'string',
                format: 'date',
            },
        },
    }), 2);
});
ava_1.default('DateControl static', t => {
    const renderer = new date_control_1.DateControl();
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    const result = renderer.render();
    const className = result.className;
    t.true(className.indexOf('root_properties_foo') !== -1);
    t.true(result.className.indexOf('control') !== -1);
    t.is(result.childNodes.length, 3);
    const label = result.children[0];
    t.is(label.tagName, 'LABEL');
    t.is(label.textContent, 'Foo');
    const input = result.children[1];
    t.is(input.tagName, 'INPUT');
    t.is(input.type, 'date');
    t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
    const validation = result.children[2];
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('DateControl static no label', t => {
    const data = { 'foo': '1961-04-12' };
    const uiSchema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo',
        },
        label: false,
    };
    const renderer = new date_control_1.DateControl();
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    t.true(result.className.indexOf('control') !== -1);
    t.is(result.childNodes.length, 3);
    const label = result.children[0];
    t.is(label.tagName, 'LABEL');
    t.is(label.textContent, '');
    const input = result.children[1];
    t.is(input.tagName, 'INPUT');
    t.is(input.type, 'date');
    t.deepEqual(input.valueAsDate, new Date('1961-04-12'));
    const validation = result.children[2];
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('DateControl inputChange', t => {
    const renderer = new date_control_1.DateControl();
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    const result = renderer.render();
    const input = result.children[1];
    input.valueAsDate = new Date('1961-04-12');
    input.oninput(null);
    t.is(t.context.data.foo, '1961-04-12');
});
ava_1.default('DateControl inputChange null', t => {
    const renderer = new date_control_1.DateControl();
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    const result = renderer.render();
    const input = result.children[1];
    input.valueAsDate = null;
    input.oninput(null);
    t.is(t.context.data.foo, undefined);
});
ava_1.default('DateControl inputChange undefined', t => {
    const renderer = new date_control_1.DateControl();
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    const result = renderer.render();
    const input = result.children[1];
    input.valueAsDate = undefined;
    input.oninput(null);
    t.is(t.context.data.foo, undefined);
});
ava_1.default('DateControl dataService notification', t => {
    const renderer = new date_control_1.DateControl();
    const data = { 'foo': '1961-04-12' };
    const dataService = new data_service_1.DataService(data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(t.context.uiSchema, '1980-04-04');
    t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
});
ava_1.default.failing('DateControl dataService notification value undefined', t => {
    const renderer = new date_control_1.DateControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(t.context.uiSchema, undefined);
    t.is(input.valueAsDate, null);
});
ava_1.default.failing('DateControl dataService notification value null', t => {
    const renderer = new date_control_1.DateControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/foo' } }, null);
    t.is(input.valueAsDate, null);
});
ava_1.default('DateControl dataService notification wrong ref', t => {
    const renderer = new date_control_1.DateControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/bar' } }, 'Bar');
    t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
});
ava_1.default('DateControl dataService notification null ref', t => {
    const renderer = new date_control_1.DateControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(null, '1961-04-12');
    t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
});
ava_1.default('DateControl dataService notification undefined ref', t => {
    const renderer = new date_control_1.DateControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(undefined, '1961-04-12');
    t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
});
ava_1.default('DateControl dataService no notification after disconnect', t => {
    const renderer = new date_control_1.DateControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/foo' } }, 'Bar');
    t.deepEqual(input.valueAsDate, new Date('1980-04-04'));
});
ava_1.default('DateControl notify visible false', t => {
    base_control_tests_1.testHide(t, new date_control_1.DateControl());
});
ava_1.default('DateControl notify visible true', t => {
    base_control_tests_1.testShow(t, new date_control_1.DateControl());
});
ava_1.default('DateControl notify disabled', t => {
    base_control_tests_1.testDisable(t, new date_control_1.DateControl());
});
ava_1.default('DateControl notify enabled', t => {
    base_control_tests_1.testEnable(t, new date_control_1.DateControl());
});
ava_1.default('DateControl notify one error', t => {
    base_control_tests_1.testOneError(t, new date_control_1.DateControl());
});
ava_1.default('DateControl notify multiple errors', t => {
    base_control_tests_1.testMultipleErrors(t, new date_control_1.DateControl());
});
ava_1.default('DateControl notify errors undefined', t => {
    base_control_tests_1.testUndefinedErrors(t, new date_control_1.DateControl());
});
ava_1.default('DateControl notify errors null', t => {
    base_control_tests_1.testNullErrors(t, new date_control_1.DateControl());
});
ava_1.default('DateControl notify errors clean', t => {
    base_control_tests_1.testResetErrors(t, new date_control_1.DateControl());
});
ava_1.default('DateControl disconnected no notify visible', t => {
    base_control_tests_1.testNotifyAboutVisibiltyWhenDisconnected(t, new date_control_1.DateControl());
});
ava_1.default('DateControl disconnected no notify enabled', t => {
    base_control_tests_1.testNotifyAboutEnablementWhenDisconnected(t, new date_control_1.DateControl());
});
ava_1.default('DateControl disconnected no notify error', t => {
    base_control_tests_1.testNotifyAboutValidationWhenDisconnected(t, new date_control_1.DateControl());
});
//# sourceMappingURL=date.control.test.js.map