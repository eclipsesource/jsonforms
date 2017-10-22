"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../../src/renderers/JSX");
const ava_1 = require("ava");
const setup_1 = require("../helpers/setup");
const text_control_1 = require("../../src/renderers/controls/text.control");
const core_1 = require("../../src/core");
const inferno_test_utils_1 = require("inferno-test-utils");
const actions_1 = require("../../src/actions");
const inferno_redux_1 = require("inferno-redux");
const index_1 = require("../../src/reducers/index");
ava_1.default.before(() => {
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
    t.context.data = { 'name': 'Foo' };
    t.context.schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                minLength: 3
            }
        }
    };
    t.context.uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/name'
        }
    };
});
ava_1.default('tester', t => {
    t.is(text_control_1.textControlTester(undefined, undefined), -1);
    t.is(text_control_1.textControlTester(null, undefined), -1);
    t.is(text_control_1.textControlTester({ type: 'Foo' }, undefined), -1);
    // scope is missing
    t.is(text_control_1.textControlTester({ type: 'Control' }, undefined), -1);
});
ava_1.default('render', t => {
    const schema = {
        type: 'object',
        properties: {
            name: { type: 'string' }
        }
    };
    const data = { 'name': 'Foo' };
    const store = setup_1.initJsonFormsStore(data, schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: schema, uischema: t.context.uischema })));
    const control = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'control');
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'root_properties_name'), undefined);
    t.is(control.childNodes.length, 3);
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, 'Name');
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.is(input.value, 'Foo');
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('render without label', t => {
    const uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/name'
        },
        label: false
    };
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: t.context.schema, uischema: uischema })));
    const control = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'control');
    t.not(control, undefined);
    t.is(control.childNodes.length, 3);
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, '');
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.is(input.value, 'Foo');
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('update via input event', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    input.value = 'Bar';
    setup_1.dispatchInputEvent(input);
    t.is(index_1.getData(store.getState()).name, 'Bar');
});
ava_1.default('update via action', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update('name', () => 'Bar'));
    t.is(input.value, 'Bar');
});
ava_1.default('update with undefined value', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update('name', () => undefined));
    t.is(input.value, '');
});
ava_1.default('update with null value', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update('name', () => null));
    t.is(input.value, '');
});
ava_1.default('update with wrong ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update('firstname', () => 'Bar'));
    t.is(input.value, 'Foo');
});
ava_1.default('update with null ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update(null, () => 'Bar'));
    t.is(input.value, 'Foo');
});
ava_1.default('update with undefined ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update(undefined, () => 'Bar'));
    t.is(input.value, 'Foo');
});
ava_1.default('hide', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: t.context.schema, uischema: t.context.uischema, visible: false })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.true(input.hidden);
});
ava_1.default('show by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.false(input.hidden);
});
ava_1.default('disable', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: t.context.schema, uischema: t.context.uischema, enabled: false })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.true(input.disabled);
});
ava_1.default('enabled by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.false(input.disabled);
});
ava_1.default('single error', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('name', () => 'a'));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, 'should NOT be shorter than 3 characters');
});
ava_1.default('multiple errors', t => {
    const schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                minLength: 3,
                enum: ['foo', 'bar']
            }
        }
    };
    const store = setup_1.initJsonFormsStore(t.context.data, schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('name', () => 'a'));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, 'should NOT be shorter than 3 characters\nshould be equal to one of the allowed values');
});
ava_1.default('empty errors by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.textContent, '');
});
ava_1.default('reset validation message', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(text_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('name', () => 'a'));
    store.dispatch(actions_1.update('name', () => 'aaa'));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, '');
});
//# sourceMappingURL=text.control.test.js.map