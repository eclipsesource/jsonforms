"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../../src/renderers/JSX");
const ava_1 = require("ava");
const date_control_1 = require("../../src/renderers/controls/date.control");
const core_1 = require("../../src/core");
const setup_1 = require("../helpers/setup");
const inferno_test_utils_1 = require("inferno-test-utils");
const inferno_redux_1 = require("inferno-redux");
const index_1 = require("../../src/reducers/index");
const actions_1 = require("../../src/actions");
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
    t.context.data = { 'foo': '1980-04-04' };
    t.context.schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'string',
                format: 'date'
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
    t.is(date_control_1.dateControlTester(undefined, undefined), -1);
    t.is(date_control_1.dateControlTester(null, undefined), -1);
    t.is(date_control_1.dateControlTester({ type: 'Foo' }, undefined), -1);
    t.is(date_control_1.dateControlTester({ type: 'Control' }, undefined), -1);
});
ava_1.default('tester with wrong prop type', t => {
    t.is(date_control_1.dateControlTester(t.context.uischmea, {
        type: 'object',
        properties: {
            foo: { type: 'string' },
        },
    }), -1);
});
ava_1.default('tester with wrong prop type, but sibling has correct one', t => {
    t.is(date_control_1.dateControlTester(t.context.uischema, {
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
ava_1.default('tester with correct prop type', t => {
    t.is(date_control_1.dateControlTester(t.context.uischema, {
        type: 'object',
        properties: {
            foo: {
                type: 'string',
                format: 'date',
            },
        },
    }), 2);
});
ava_1.default('render', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const control = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'control');
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.not(control, undefined);
    t.is(control.childNodes.length, 3);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'valid'), undefined);
    t.is(label.textContent, 'Foo');
    t.is(input.type, 'date');
    t.is(input.value, '1980-04-04');
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('render without label', t => {
    const uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo',
        },
        label: false,
    };
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: uischema })));
    const control = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'control');
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.not(control, undefined);
    t.is(control.childNodes.length, 3);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'valid'), undefined);
    t.is(label.textContent, '');
    t.is(input.type, 'date');
    t.is(input.value, '1980-04-04');
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('update via event', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    input.value = '1961-04-12';
    setup_1.dispatchInputEvent(input);
    t.is(index_1.getData(store.getState()).foo, '1961-04-12');
});
ava_1.default('update via action', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update('foo', () => '1961-04-12'));
    t.is(input.value, '1961-04-12');
});
ava_1.default.failing('update with null value', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    input.value = '';
    setup_1.dispatchInputEvent(input);
    // FIXME: how does reset of date value look like?
    t.is(index_1.getData(store.getState()).foo, '1970-01-01');
});
ava_1.default.failing('update with undefined value', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    input.value = undefined;
    setup_1.dispatchInputEvent(input);
    t.is(index_1.getData(store.getState()).foo, '1970-01-01');
});
ava_1.default('update with wrong ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    input.value = undefined;
    setup_1.dispatchInputEvent(input);
    store.dispatch(actions_1.update('bar', () => 'Bar'));
    t.is(input.value, '1980-04-04');
});
ava_1.default('update with null ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    input.value = undefined;
    setup_1.dispatchInputEvent(input);
    store.dispatch(actions_1.update(null, () => '1961-04-12'));
    t.is(input.value, '1980-04-04');
});
ava_1.default('update with undefined ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    input.value = undefined;
    setup_1.dispatchInputEvent(input);
    store.dispatch(actions_1.update(undefined, () => '1961-04-12'));
    t.is(input.value, '1980-04-04');
});
ava_1.default('hide', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: t.context.uischema, visible: false })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.true(input.hidden);
});
ava_1.default('show by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.false(input.hidden);
});
ava_1.default('disable', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: t.context.uischema, enabled: false })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.true(input.disabled);
});
ava_1.default('enabled by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.false(input.disabled);
});
ava_1.default('single error', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('foo', () => 2));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, 'should be string');
});
ava_1.default('multiple errors', t => {
    const schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'string',
                'format': 'date',
                'enum': ['1985-01-01']
            }
        }
    };
    const store = setup_1.initJsonFormsStore(t.context.data, schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('foo', () => 3));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, 'should be string\nshould be equal to one of the allowed values');
});
ava_1.default('empty errors by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.textContent, '');
});
ava_1.default('reset validation message', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(date_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('foo', () => 3));
    store.dispatch(actions_1.update('foo', () => '1961-04-12'));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, '');
});
//# sourceMappingURL=date.control.test.js.map