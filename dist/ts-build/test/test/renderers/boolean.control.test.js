"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const installCE = require("document-register-element/pony");
// inject window, document etc.
require("jsdom-global/register");
installCE(global, 'force');
const data_service_1 = require("../../src/core/data.service");
const boolean_control_1 = require("../../src/renderers/controls/boolean.control");
const base_control_tests_1 = require("./base.control.tests");
ava_1.default.beforeEach(t => {
    t.context.data = { 'foo': true };
    t.context.schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'boolean'
            }
        }
    };
    t.context.uiSchema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
});
ava_1.default('BooleanControlTester', t => {
    t.is(boolean_control_1.booleanControlTester(undefined, undefined), -1);
    t.is(boolean_control_1.booleanControlTester(null, undefined), -1);
    t.is(boolean_control_1.booleanControlTester({ type: 'Foo' }, undefined), -1);
    t.is(boolean_control_1.booleanControlTester({ type: 'Control' }, undefined), -1);
});
ava_1.default('BooleanControl tester with wrong prop type', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.is(boolean_control_1.booleanControlTester(control, { type: 'object', properties: { foo: { type: 'string' } } }), -1);
});
ava_1.default('Boolean control tester with wrong prop type, but sibling has correct one', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.is(boolean_control_1.booleanControlTester(control, {
        type: 'object',
        properties: {
            foo: {
                type: 'string'
            },
            bar: {
                type: 'boolean'
            }
        }
    }), -1);
});
ava_1.default('BooleanControl tester with matching prop type', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.is(boolean_control_1.booleanControlTester(control, {
        type: 'object',
        properties: {
            foo: {
                type: 'boolean'
            }
        }
    }), 2);
});
ava_1.default('BooleanControl static', t => {
    const renderer = new boolean_control_1.BooleanControl();
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    const result = renderer.render();
    t.is(result.className, 'control');
    t.is(result.childNodes.length, 3);
    const label = result.children[0];
    t.is(label.tagName, 'LABEL');
    t.is(label.textContent, 'Foo');
    const input = result.children[1];
    t.is(input.tagName, 'INPUT');
    t.is(input.type, 'checkbox');
    t.is(input.checked, true);
    const validation = result.children[2];
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('BooleanControl static no label', t => {
    const renderer = new boolean_control_1.BooleanControl();
    const data = { 'foo': false };
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(t.context.schema);
    const controlWithoutLabel = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: false
    };
    renderer.setUiSchema(controlWithoutLabel);
    const result = renderer.render();
    t.is(result.className, 'control');
    t.is(result.childNodes.length, 3);
    const label = result.children[0];
    t.is(label.tagName, 'LABEL');
    t.is(label.textContent, '');
    const input = result.children[1];
    t.is(input.tagName, 'INPUT');
    t.is(input.type, 'checkbox');
    t.is(input.checked, false);
    const validation = result.children[2];
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('BooleanControl inputChange', t => {
    const renderer = new boolean_control_1.BooleanControl();
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    const result = renderer.render();
    const input = result.children[1];
    input.checked = false;
    input.onchange(null);
    t.is(t.context.data.foo, false);
});
ava_1.default('BooleanControl dataService notification', t => {
    const renderer = new boolean_control_1.BooleanControl();
    const data = { 'foo': false };
    const dataService = new data_service_1.DataService(data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/foo' } }, true);
    t.is(input.checked, true);
});
ava_1.default('BooleanControl dataService notification value undefined', t => {
    const renderer = new boolean_control_1.BooleanControl();
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
    t.is(input.checked, false);
});
ava_1.default('BooleanControl dataService notification value null', t => {
    const renderer = new boolean_control_1.BooleanControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/foo' } }, null);
    t.is(input.checked, false);
});
ava_1.default('BooleanControl dataService notification wrong ref', t => {
    const renderer = new boolean_control_1.BooleanControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/bar' } }, 'Bar');
    t.is(input.checked, true);
});
ava_1.default('BooleanControl dataService notification null ref', t => {
    const renderer = new boolean_control_1.BooleanControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(null, false);
    t.is(input.checked, true);
});
ava_1.default('BooleanControl dataService notification undefined ref', t => {
    const renderer = new boolean_control_1.BooleanControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(undefined, false);
    t.is(input.checked, true);
});
ava_1.default('BooleanControl dataService no notification after disconnect', t => {
    const renderer = new boolean_control_1.BooleanControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/foo' } }, 'Bar');
    t.is(input.checked, true);
});
ava_1.default('BooleanControl notify visible false', t => {
    base_control_tests_1.testHide(t, new boolean_control_1.BooleanControl());
});
ava_1.default('BooleanControl notify visible true', t => {
    base_control_tests_1.testShow(t, new boolean_control_1.BooleanControl());
});
ava_1.default('BooleanControl notify disabled', t => {
    base_control_tests_1.testDisable(t, new boolean_control_1.BooleanControl());
});
ava_1.default('BooleanControl notify enabled', t => {
    base_control_tests_1.testEnable(t, new boolean_control_1.BooleanControl());
});
ava_1.default('BooleanControl notify one error', t => {
    base_control_tests_1.testOneError(t, new boolean_control_1.BooleanControl());
});
ava_1.default('BooleanControl notify multiple errors', t => {
    base_control_tests_1.testMultipleErrors(t, new boolean_control_1.BooleanControl());
});
ava_1.default('BooleanControl notify errors undefined', t => {
    base_control_tests_1.testUndefinedErrors(t, new boolean_control_1.BooleanControl());
});
ava_1.default('BooleanControl notify errors null', t => {
    base_control_tests_1.testNullErrors(t, new boolean_control_1.BooleanControl());
});
ava_1.default('BooleanControl notify errors clean', t => {
    base_control_tests_1.testResetErrors(t, new boolean_control_1.BooleanControl());
});
ava_1.default('BooleanControl disconnected no notify visible', t => {
    base_control_tests_1.testNotifyAboutVisibiltyWhenDisconnected(t, new boolean_control_1.BooleanControl());
});
ava_1.default('BooleanControl disconnected no notify enabled', t => {
    base_control_tests_1.testNotifyAboutEnablementWhenDisconnected(t, new boolean_control_1.BooleanControl());
});
ava_1.default('BooleanControl disconnected no notify error', t => {
    base_control_tests_1.testNotifyAboutValidationWhenDisconnected(t, new boolean_control_1.BooleanControl());
});
//# sourceMappingURL=boolean.control.test.js.map