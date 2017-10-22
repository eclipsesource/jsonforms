"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../../src/renderers/JSX");
const ava_1 = require("ava");
const setup_1 = require("../helpers/setup");
const enum_control_1 = require("../../src/renderers/controls/enum.control");
const core_1 = require("../../src/core");
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
    t.context.data = { 'foo': 'a' };
    t.context.schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'string',
                'enum': ['a', 'b'],
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
    t.is(enum_control_1.enumControlTester(undefined, undefined), -1);
    t.is(enum_control_1.enumControlTester(null, undefined), -1);
    t.is(enum_control_1.enumControlTester({ type: 'Foo' }, undefined), -1);
    t.is(enum_control_1.enumControlTester({ type: 'Control' }, undefined), -1);
});
ava_1.default('tester with wrong prop type', t => {
    t.is(enum_control_1.enumControlTester(t.context.uischema, { type: 'object', properties: { foo: { type: 'string' } } }), -1);
});
ava_1.default('tester with wrong prop type, but sibling has correct one', t => {
    t.is(enum_control_1.enumControlTester(t.context.uischema, {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'string'
            },
            'bar': {
                'type': 'string',
                'enum': ['a', 'b']
            }
        }
    }), -1);
});
ava_1.default('tester with matching string type', t => {
    t.is(enum_control_1.enumControlTester(t.context.uischema, {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'string',
                'enum': ['a', 'b']
            }
        }
    }), 2);
});
ava_1.default('tester with matching numeric type', t => {
    // TODO should this be true?
    t.is(enum_control_1.enumControlTester(t.context.uischema, {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'number',
                'enum': [1, 2]
            }
        }
    }), 2);
});
ava_1.default('render', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const control = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'control');
    t.not(control, undefined);
    t.is(control.childNodes.length, 3);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'valid'), undefined);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'control'), undefined);
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, 'Foo');
    const select = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'select');
    t.is(select.tagName, 'SELECT');
    t.is(select.value, 'a');
    t.is(select.options.length, 3);
    t.is(select.options.item(0).value, '');
    t.is(select.options.item(1).value, 'a');
    t.is(select.options.item(2).value, 'b');
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('render without label', t => {
    const uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: false
    };
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: uischema })));
    const control = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'control');
    t.not(control, undefined);
    t.is(control.childNodes.length, 3);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'valid'), undefined);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'control'), undefined);
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, '');
    const select = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'select');
    t.is(select.tagName, 'SELECT');
    t.is(select.value, 'a');
    t.is(select.options.length, 3);
    t.is(select.options.item(0).value, '');
    t.is(select.options.item(1).value, 'a');
    t.is(select.options.item(2).value, 'b');
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('update via input event', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const select = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'select');
    select.value = 'b';
    setup_1.dispatchInputEvent(select);
    t.is(index_1.getData(store.getState()).foo, 'b');
});
ava_1.default('update via action', t => {
    const data = { 'foo': 'b' };
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const select = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'select');
    store.dispatch(actions_1.update('foo', () => 'b'));
    t.is(select.value, 'b');
});
ava_1.default('update with undefined value', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const select = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'select');
    store.dispatch(actions_1.update('foo', () => undefined));
    t.is(select.selectedIndex, 0);
    t.is(select.value, '');
});
ava_1.default('update with null value', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const select = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'select');
    store.dispatch(actions_1.update('foo', () => null));
    t.is(select.selectedIndex, 0);
    t.is(select.value, '');
});
ava_1.default('update with wrong ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const select = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'select');
    store.dispatch(actions_1.update('bar', () => 'Bar'));
    t.is(select.selectedIndex, 1);
    t.is(select.value, 'a');
});
ava_1.default('update with null ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const select = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'select');
    store.dispatch(actions_1.update(null, () => false));
    t.is(select.selectedIndex, 1);
    t.is(select.value, 'a');
});
ava_1.default('update with undefined ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const select = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'select');
    store.dispatch(actions_1.update(undefined, () => false));
    t.is(select.selectedIndex, 1);
    t.is(select.value, 'a');
});
ava_1.default('hide', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: t.context.uischema, visible: false })));
    const select = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'select');
    t.true(select.hidden);
});
ava_1.default('show by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const select = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'select');
    t.false(select.hidden);
});
//
ava_1.default('disable', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: t.context.uischema, enabled: false })));
    const select = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'select');
    t.true(select.disabled);
});
ava_1.default('enabled by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const select = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'select');
    t.false(select.disabled);
});
ava_1.default('single error', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('foo', () => 'c'));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, 'should be equal to one of the allowed values');
});
ava_1.default('multiple errors', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('foo', () => 3));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, 'should be equal to one of the allowed values\nshould be string');
});
ava_1.default('empty errors by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.textContent, '');
});
ava_1.default('reset validation message', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(enum_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('foo', () => 'c'));
    store.dispatch(actions_1.update('foo', () => 'a'));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, '');
});
//# sourceMappingURL=enum.control.test.js.map