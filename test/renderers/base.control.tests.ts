import { DataService } from '../../src/core/data.service';
import { Runtime } from '../../src/core/runtime';

export const testHide = (t, renderer) => {
    const dataService = new DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime as Runtime;
    runtime.visible = false;
    t.is(renderer.hidden, true);
};

export const testShow = (t, renderer) => {
    const dataService = new DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime as Runtime;
    runtime.visible = true;
    t.is(renderer.hidden, false);
};

export const testDisable = (t, renderer, inputIndex = 1) => {
    const dataService = new DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime as Runtime;
    runtime.enabled = false;
    const input = renderer.children[inputIndex] as HTMLInputElement;
    t.is(input.getAttribute('disabled'), 'true');
    // TODO would be nice
    // t.is(input.disabled, true);
};

export const testEnable = (t, renderer, inputIndex = 1) => {
    const dataService = new DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime as Runtime;
    runtime.enabled = true;
    const input = renderer.children[inputIndex] as HTMLInputElement;
    t.false(input.hasAttribute('disabled'));
};

export const testOneError = (t, renderer) => {
    const dataService = new DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime as Runtime;
    runtime.validationErrors = ['error a'];
    const errorsDiv = renderer.getElementsByClassName('validation')[0];
    t.is(errorsDiv.textContent, 'error a');
};

export const testMultipleErrors = (t, renderer) => {
    const dataService = new DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime as Runtime;
    runtime.validationErrors = ['error a', 'error b'];
    const errorsDiv = renderer.getElementsByClassName('validation')[0];
    t.is(errorsDiv.textContent, 'error a\nerror b');
};

export const testUndefinedErrors = (t, renderer) => {
    const dataService = new DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime as Runtime;
    runtime.validationErrors = undefined;
    const errorsDiv = renderer.getElementsByClassName('validation')[0];
    t.is(errorsDiv.textContent, '');
};

export const testNullErrors = (t, renderer) => {
    const dataService = new DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime as Runtime;
    runtime.validationErrors = null;
    const errorsDiv = renderer.getElementsByClassName('validation')[0];
    t.is(errorsDiv.textContent, '');
};

export const testResetErrors = (t, renderer) => {
    const dataService = new DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime as Runtime;
    runtime.validationErrors = ['error a'];
    runtime.validationErrors = undefined;
    const errorsDiv = renderer.getElementsByClassName('validation')[0];
    t.is(errorsDiv.textContent, '');
};

export const testNotifyAboutVisibiltyWhenDisconnected = (t, renderer) => {
    const dataService = new DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime as Runtime;
    runtime.visible = true;
    renderer.disconnectedCallback();
    runtime.visible = false;
    t.is(renderer.hidden, false);
};

export const testNotifyAboutEnablementWhenDisconnected = (t, renderer, inputIndex = 1) => {
    const dataService = new DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const runtime = t.context.uiSchema.runtime as Runtime;
    runtime.enabled = false;
    const input = renderer.children[inputIndex] as HTMLInputElement;
    t.false(input.hasAttribute('disabled'));
};

export const testNotifyAboutValidationWhenDisconnected = (t, renderer) => {
    const dataService = new DataService(t.context.data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const runtime = t.context.uiSchema.runtime as Runtime;
    runtime.validationErrors = ['error a'];
    const errorsDiv = renderer.getElementsByClassName('validation')[0];
    t.not(
        errorsDiv.textContent,
        'error a',
        'Disconnected Controls should not be notified about new errors.',
    );
};
