"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_service_1 = require("../../src/core/data.service");
exports.testHide = (t, renderer) => {
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.visible = false;
    t.is(renderer.hidden, true);
};
exports.testShow = (t, renderer) => {
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.visible = true;
    t.is(renderer.hidden, false);
};
exports.testDisable = (t, renderer) => {
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.enabled = false;
    const input = renderer.children[1];
    t.is(input.getAttribute('disabled'), 'true');
    // TODO would be nice
    // t.is(input.disabled, true);
};
exports.testEnable = (t, renderer) => {
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.enabled = true;
    const input = renderer.children[1];
    t.false(input.hasAttribute('disabled'));
};
exports.testOneError = (t, renderer) => {
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.validationErrors = ['error a'];
    const errorsDiv = renderer.getElementsByClassName('validation')[0];
    t.is(errorsDiv.textContent, 'error a');
};
exports.testMultipleErrors = (t, renderer) => {
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.validationErrors = ['error a', 'error b'];
    const errorsDiv = renderer.getElementsByClassName('validation')[0];
    t.is(errorsDiv.textContent, 'error a\nerror b');
};
exports.testUndefinedErrors = (t, renderer) => {
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.validationErrors = undefined;
    const errorsDiv = renderer.getElementsByClassName('validation')[0];
    t.is(errorsDiv.textContent, '');
};
exports.testNullErrors = (t, renderer) => {
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.validationErrors = null;
    const errorsDiv = renderer.getElementsByClassName('validation')[0];
    t.is(errorsDiv.textContent, '');
};
exports.testResetErrors = (t, renderer) => {
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.validationErrors = ['error a'];
    runtime.validationErrors = undefined;
    const errorsDiv = renderer.getElementsByClassName('validation')[0];
    t.is(errorsDiv.textContent, '');
};
exports.testNotifyAboutVisibiltyWhenDisconnected = (t, renderer) => {
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.visible = false;
    t.is(renderer.hidden, false);
};
exports.testNotifyAboutEnablementWhenDisconnected = (t, renderer) => {
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.enabled = false;
    const input = renderer.children[1];
    t.false(input.hasAttribute('disabled'));
};
exports.testNotifyAboutValidationWhenDisconnected = (t, renderer) => {
    const dataService = new data_service_1.DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.validationErrors = ['error a'];
    const errorsDiv = renderer.getElementsByClassName('validation')[0];
    t.not(errorsDiv.textContent, 'error a', 'Disconnected Controls should not be notified about new errors.');
};
//# sourceMappingURL=base.control.tests.js.map