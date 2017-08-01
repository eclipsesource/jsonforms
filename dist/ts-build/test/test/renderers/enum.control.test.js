"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const installCE = require("document-register-element/pony");
// inject window, document etc.
require("jsdom-global/register");
installCE(global, 'force');
const data_service_1 = require("../../src/core/data.service");
const enum_control_1 = require("../../src/renderers/controls/enum.control");
const base_control_tests_1 = require("./base.control.tests");
ava_1.default.beforeEach(t => {
    t.context.data = { 'foo': 'a' };
    t.context.schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'string',
                enum: ['a', 'b'],
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
ava_1.default('EnumControlTester', t => {
    t.is(enum_control_1.enumControlTester(undefined, undefined), -1);
    t.is(enum_control_1.enumControlTester(null, undefined), -1);
    t.is(enum_control_1.enumControlTester({ type: 'Foo' }, undefined), -1);
    t.is(enum_control_1.enumControlTester({ type: 'Control' }, undefined), -1);
});
ava_1.default('EnumControl tester with wrong prop type', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.is(enum_control_1.enumControlTester(control, { type: 'object', properties: { foo: { type: 'string' } } }), -1);
});
ava_1.default('EnumControl tester with wrong prop type, but sibling has correct one', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.is(enum_control_1.enumControlTester(control, {
        type: 'object',
        properties: {
            foo: {
                type: 'string'
            },
            bar: {
                type: 'string',
                enum: ['a', 'b']
            }
        }
    }), -1);
});
ava_1.default('EnumControl tester with matching string type', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.is(enum_control_1.enumControlTester(control, {
        type: 'object',
        properties: {
            foo: {
                type: 'string',
                enum: ['a', 'b']
            }
        }
    }), 2);
});
ava_1.default('EnumControl tester with matching numeric type', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    // TODO should this be true?
    t.is(enum_control_1.enumControlTester(control, {
        type: 'object',
        properties: {
            foo: {
                type: 'number',
                enum: [1, 2]
            }
        }
    }), 2);
});
ava_1.default('EnumControl static', t => {
    const renderer = new enum_control_1.EnumControl();
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
    t.is(input.tagName, 'SELECT');
    t.is(input.value, 'a');
    t.is(input.options.length, 2);
    t.is(input.options.item(0).value, 'a');
    t.is(input.options.item(1).value, 'b');
    const validation = result.children[2];
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('EnumControl static no label', t => {
    const renderer = new enum_control_1.EnumControl();
    const data = { 'foo': 'b' };
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
    t.is(result.className, 'control');
    t.is(result.childNodes.length, 3);
    const label = result.children[0];
    t.is(label.tagName, 'LABEL');
    t.is(label.textContent, '');
    const input = result.children[1];
    t.is(input.tagName, 'SELECT');
    t.is(input.value, 'b');
    t.is(input.options.length, 2);
    t.is(input.options.item(0).value, 'a');
    t.is(input.options.item(1).value, 'b');
    const validation = result.children[2];
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('EnumControl inputChange', t => {
    const renderer = new enum_control_1.EnumControl();
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    const result = renderer.render();
    const input = result.children[1];
    input.value = 'b';
    input.onchange(null);
    t.is(t.context.data.foo, 'b');
});
ava_1.default('EnumControl dataService notification', t => {
    const renderer = new enum_control_1.EnumControl();
    const data = { 'foo': 'b' };
    const dataService = new data_service_1.DataService(data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    t.is(input.selectedIndex, 1);
    t.is(input.value, 'b');
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/foo' } }, 'a');
    t.is(input.value, 'a');
    t.is(input.selectedIndex, 0);
});
ava_1.default.failing('EnumControl dataService notification value undefined', t => {
    const renderer = new enum_control_1.EnumControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({
        scope: {
            $ref: '#/properties/foo',
        },
    }, undefined);
    t.is(input.selectedIndex, -1);
});
ava_1.default.failing('EnumControl dataService notification value null', t => {
    const renderer = new enum_control_1.EnumControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/foo' } }, null);
    t.is(input.selectedIndex, -1);
});
ava_1.default('EnumControl dataService notification wrong ref', t => {
    const renderer = new enum_control_1.EnumControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({
        scope: {
            $ref: '#/properties/bar',
        },
    }, 'Bar');
    t.is(input.value, 'a');
    t.is(input.selectedIndex, 0);
});
ava_1.default('EnumControl dataService notification null ref', t => {
    const renderer = new enum_control_1.EnumControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(null, false);
    t.is(input.value, 'a');
    t.is(input.selectedIndex, 0);
});
ava_1.default('EnumControl dataService notification undefined ref', t => {
    const renderer = new enum_control_1.EnumControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(undefined, false);
    t.is(input.value, 'a');
    t.is(input.selectedIndex, 0);
});
ava_1.default('EnumControl dataService no notification after disconnect', t => {
    const renderer = new enum_control_1.EnumControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/foo' } }, 'Bar');
    t.is(input.value, 'a');
    t.is(input.selectedIndex, 0);
});
ava_1.default('EnumControl notify visible false', t => {
    base_control_tests_1.testHide(t, new enum_control_1.EnumControl());
});
ava_1.default('EnumControl notify visible true', t => {
    base_control_tests_1.testShow(t, new enum_control_1.EnumControl());
});
ava_1.default('EnumControl notify disabled', t => {
    base_control_tests_1.testDisable(t, new enum_control_1.EnumControl());
});
ava_1.default('EnumControl notify enabled', t => {
    base_control_tests_1.testEnable(t, new enum_control_1.EnumControl());
});
ava_1.default('EnumControl notify one error', t => {
    base_control_tests_1.testOneError(t, new enum_control_1.EnumControl());
});
ava_1.default('EnumControl notify multiple errors', t => {
    base_control_tests_1.testMultipleErrors(t, new enum_control_1.EnumControl());
});
ava_1.default('EnumControl notify errors undefined', t => {
    base_control_tests_1.testUndefinedErrors(t, new enum_control_1.EnumControl());
});
ava_1.default('EnumControl notify errors null', t => {
    base_control_tests_1.testNullErrors(t, new enum_control_1.EnumControl());
});
ava_1.default('EnumControl notify errors clean', t => {
    base_control_tests_1.testResetErrors(t, new enum_control_1.EnumControl());
});
ava_1.default('EnumControl disconnected no notify visible', t => {
    base_control_tests_1.testNotifyAboutVisibiltyWhenDisconnected(t, new enum_control_1.EnumControl());
});
ava_1.default('EnumControl disconnected no notify enabled', t => {
    base_control_tests_1.testNotifyAboutEnablementWhenDisconnected(t, new enum_control_1.EnumControl());
});
ava_1.default('EnumControl disconnected no notify error', t => {
    base_control_tests_1.testNotifyAboutValidationWhenDisconnected(t, new enum_control_1.EnumControl());
});
//# sourceMappingURL=enum.control.test.js.map