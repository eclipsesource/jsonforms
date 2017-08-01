"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const installCE = require("document-register-element/pony");
// inject window, document etc.
require("jsdom-global/register");
installCE(global, 'force');
const data_service_1 = require("../../src/core/data.service");
const label_renderer_1 = require("../../src/renderers/additional/label.renderer");
const base_control_tests_1 = require("./base.control.tests");
ava_1.default.beforeEach(t => {
    t.context.data = { 'name': 'Foo' };
    t.context.schema = { type: 'object', properties: { name: { type: 'string' } } };
    t.context.uiSchema = { type: 'Label', text: 'Bar' };
});
ava_1.default('Label tester', t => {
    t.is(label_renderer_1.labelRendererTester(undefined, undefined), -1);
    t.is(label_renderer_1.labelRendererTester(null, undefined), -1);
    t.is(label_renderer_1.labelRendererTester({ type: 'Foo' }, undefined), -1);
    t.is(label_renderer_1.labelRendererTester({ type: 'Label' }, undefined), 1);
});
ava_1.default('Render Label with static undefined text', t => {
    const renderer = new label_renderer_1.LabelRenderer();
    const uiSchema = {
        type: 'Label'
    };
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    t.is(result.className, 'jsf-label');
    t.is(result.childNodes.length, 0);
    t.is(result.textContent, '');
});
ava_1.default('Render Label with static null text', t => {
    const renderer = new label_renderer_1.LabelRenderer();
    const uiSchema = {
        type: 'Label',
        text: null
    };
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    t.is(result.className, 'jsf-label');
    t.is(result.childNodes.length, 0);
    t.is(result.textContent, '');
});
ava_1.default('Render Label with static text', t => {
    const renderer = new label_renderer_1.LabelRenderer();
    renderer.setDataService(new data_service_1.DataService(t.context.data));
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    const result = renderer.render();
    t.is(result.className, 'jsf-label');
    t.is(result.childNodes.length, 1);
    t.is(result.textContent, 'Bar');
});
ava_1.default('Hide Label', t => {
    base_control_tests_1.testHide(t, new label_renderer_1.LabelRenderer());
});
ava_1.default('Show Label', t => {
    base_control_tests_1.testShow(t, new label_renderer_1.LabelRenderer());
});
ava_1.default('Disable Label', t => {
    const renderer = new label_renderer_1.LabelRenderer();
    const labelElement = {
        type: 'Label',
        text: 'Bar'
    };
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(labelElement);
    renderer.connectedCallback();
    const runtime = labelElement.runtime;
    runtime.enabled = false;
    t.is(renderer.getAttribute('disabled'), 'true');
});
ava_1.default('Enable Label', t => {
    const renderer = new label_renderer_1.LabelRenderer();
    const labelElement = {
        type: 'Label',
        text: 'Bar'
    };
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(labelElement);
    renderer.connectedCallback();
    const runtime = labelElement.runtime;
    runtime.enabled = true;
    t.false(renderer.hasAttribute('disabled'));
});
ava_1.default('Label should not be hidden if disconnected', t => {
    base_control_tests_1.testNotifyAboutVisibiltyWhenDisconnected(t, new label_renderer_1.LabelRenderer());
});
ava_1.default('Label should not be disabled if disconnected', t => {
    const renderer = new label_renderer_1.LabelRenderer();
    const labelElement = {
        type: 'Label',
        text: 'Bar'
    };
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(labelElement);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const runtime = labelElement.runtime;
    runtime.enabled = false;
    t.false(renderer.hasAttribute('disabled'));
});
//# sourceMappingURL=label.control.test.js.map