"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
// setup import must come first
require("../helpers/setup");
// tslint:disable:ordered-imports
const data_service_1 = require("../../src/core/data.service");
const number_control_1 = require("../../src/renderers/controls/number.control");
const base_control_tests_1 = require("./base.control.tests");
ava_1.default.beforeEach(t => {
    t.context.data = { 'foo': 3.14 };
    t.context.schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'number',
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
ava_1.default('NumberControlTester', t => {
    t.is(number_control_1.numberControlTester(undefined, undefined), -1);
    t.is(number_control_1.numberControlTester(null, undefined), -1);
    t.is(number_control_1.numberControlTester({ type: 'Foo' }, undefined), -1);
    t.is(number_control_1.numberControlTester({ type: 'Control' }, undefined), -1);
});
ava_1.default('NumberControl tester with wrong schema type', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.is(number_control_1.numberControlTester(control, {
        type: 'object',
        properties: {
            foo: {
                type: 'string'
            }
        }
    }), -1);
});
ava_1.default('NumberControl tester with wrong schema type, but sibling has correct one', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.is(number_control_1.numberControlTester(control, {
        type: 'object',
        properties: {
            foo: {
                type: 'string'
            },
            bar: {
                type: 'number'
            }
        }
    }), -1);
});
ava_1.default('NumberControl tester with machting schema type', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.is(number_control_1.numberControlTester(control, {
        type: 'object',
        properties: {
            foo: {
                type: 'number'
            }
        }
    }), 2);
});
ava_1.default('NumberControl static', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'number'
            }
        }
    };
    const renderer = new number_control_1.NumberControl();
    const data = { 'foo': 3.14 };
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
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
    t.is(input.step, '0.1');
    t.is(input.valueAsNumber, 3.14);
    const validation = result.children[2];
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('NumberControl static no label', t => {
    const renderer = new number_control_1.NumberControl();
    const data = { 'foo': 2.72 };
    const uiSchemaWithNoLabel = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: false
    };
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(uiSchemaWithNoLabel);
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
    t.is(input.step, '0.1');
    t.is(input.valueAsNumber, 2.72);
    const validation = result.children[2];
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('NumberControl inputChange', t => {
    const renderer = new number_control_1.NumberControl();
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    const result = renderer.render();
    const input = result.children[1];
    input.valueAsNumber = 2.72;
    input.oninput(null);
    t.is(t.context.data.foo, 2.72);
});
ava_1.default('NumberControl dataService notification', t => {
    const renderer = new number_control_1.NumberControl();
    const data = { 'foo': 2.72 };
    const dataService = new data_service_1.DataService(data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/foo' } }, 3.14);
    t.is(input.valueAsNumber, 3.14);
});
ava_1.default('NumberControl dataService notification value undefined', t => {
    const renderer = new number_control_1.NumberControl();
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
ava_1.default('NumberControl dataService notification value null', t => {
    const renderer = new number_control_1.NumberControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/foo' } }, null);
    t.is(input.valueAsNumber, undefined);
});
ava_1.default('NumberControl dataService notification wrong ref', t => {
    const renderer = new number_control_1.NumberControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/bar' } }, 'Bar');
    t.is(input.valueAsNumber, 3.14);
});
ava_1.default('NumberControl dataService notification null ref', t => {
    const renderer = new number_control_1.NumberControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(null, 2.72);
    t.is(input.valueAsNumber, 3.14);
});
ava_1.default('NumberControl dataService notification undefined ref', t => {
    const renderer = new number_control_1.NumberControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange(undefined, 2.72);
    t.is(input.valueAsNumber, 3.14);
});
ava_1.default('NumberControl dataService no notification after disconnect', t => {
    const renderer = new number_control_1.NumberControl();
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const input = renderer.children[1];
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/foo' } }, 'Bar');
    t.is(input.valueAsNumber, 3.14);
});
ava_1.default('Number control notify visible false', t => {
    base_control_tests_1.testHide(t, new number_control_1.NumberControl());
});
ava_1.default('Number control notify visible true', t => {
    base_control_tests_1.testShow(t, new number_control_1.NumberControl());
});
ava_1.default('Number control notify disabled', t => {
    base_control_tests_1.testDisable(t, new number_control_1.NumberControl());
});
ava_1.default('Number control notify enabled', t => {
    base_control_tests_1.testEnable(t, new number_control_1.NumberControl());
});
ava_1.default('Number control notify one error', t => {
    base_control_tests_1.testOneError(t, new number_control_1.NumberControl());
});
ava_1.default('Number control notify multiple errors', t => {
    base_control_tests_1.testMultipleErrors(t, new number_control_1.NumberControl());
});
ava_1.default('Number control notify errors undefined', t => {
    base_control_tests_1.testUndefinedErrors(t, new number_control_1.NumberControl());
});
ava_1.default('Number control notify errors null', t => {
    base_control_tests_1.testNullErrors(t, new number_control_1.NumberControl());
});
ava_1.default('Number control notify errors clean', t => {
    base_control_tests_1.testResetErrors(t, new number_control_1.NumberControl());
});
ava_1.default('Number control disconnected no notify visible', t => {
    base_control_tests_1.testNotifyAboutVisibiltyWhenDisconnected(t, new number_control_1.NumberControl());
});
ava_1.default('Number control disconnected no notify enabled', t => {
    base_control_tests_1.testNotifyAboutEnablementWhenDisconnected(t, new number_control_1.NumberControl());
});
ava_1.default('Number control disconnected no notify error', t => {
    base_control_tests_1.testNotifyAboutValidationWhenDisconnected(t, new number_control_1.NumberControl());
});
//# sourceMappingURL=number.control.test.js.map