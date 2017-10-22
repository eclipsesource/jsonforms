"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../../src/renderers/JSX");
const inferno_test_utils_1 = require("inferno-test-utils");
const ava_1 = require("ava");
const integer_control_1 = require("../../src/renderers/controls/integer.control");
const core_1 = require("../../src/core");
const setup_1 = require("../helpers/setup");
const setup_2 = require("../helpers/setup");
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
    t.context.data = { 'foo': 42 };
    t.context.schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'integer',
                minimum: 5
            },
        },
    };
    t.context.uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo',
        },
    };
});
ava_1.default('tester', t => {
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
ava_1.default('render', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const control = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'control');
    t.not(control, undefined);
    t.is(control.childNodes.length, 3);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'valid'), undefined);
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, 'Foo');
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.is(input.type, 'number');
    t.is(input.step, '1');
    t.is(input.value, '42');
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('render without label', t => {
    const data = { 'foo': 13 };
    const uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: false
    };
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: uischema })));
    const control = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'control');
    t.not(control, undefined);
    t.is(control.childNodes.length, 3);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'valid'), undefined);
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, '');
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.is(input.type, 'number');
    t.is(input.step, '1');
    t.is(input.value, '13');
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('update via input event', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    input.value = '13';
    setup_2.dispatchInputEvent(input);
    t.is(index_1.getData(store.getState()).foo, 13);
});
ava_1.default('update via action', t => {
    const data = { 'foo': 13 };
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update('foo', () => 42));
    t.is(input.value, '42');
});
ava_1.default('update with undefined value', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.is(input.value, '42');
    store.dispatch(actions_1.update('foo', () => undefined));
    t.is(input.value, '');
});
ava_1.default('update with null value', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update('foo', () => null));
    t.is(input.value, '');
});
ava_1.default('update with wrong ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update('bar', () => 11));
    t.is(input.value, '42');
});
ava_1.default('update with null ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update(null, () => 13));
    t.is(input.value, '42');
});
ava_1.default('update with undefined ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    store.dispatch(actions_1.update(undefined, () => 13));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.is(input.value, '42');
});
ava_1.default('hide', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: t.context.uischema, visible: false })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.true(input.hidden);
});
ava_1.default('show by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.false(input.hidden);
});
ava_1.default('disable', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: t.context.uischema, enabled: false })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.true(input.disabled);
});
ava_1.default('enabled by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.false(input.disabled);
});
ava_1.default('single error', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('foo', () => 2));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, 'should be >= 5');
});
ava_1.default('multiple errors', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'number',
                minimum: 4,
                enum: [4, 6, 8]
            }
        }
    };
    const store = setup_1.initJsonFormsStore(t.context.data, schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('foo', () => 3));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, 'should be >= 4\nshould be equal to one of the allowed values');
});
ava_1.default('empty errors by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.textContent, '');
});
ava_1.default('reset validation message', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(integer_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('foo', () => 3));
    store.dispatch(actions_1.update('foo', () => 10));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, '');
});
//# sourceMappingURL=integer.control.test.js.map