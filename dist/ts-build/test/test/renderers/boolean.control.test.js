"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../../src/renderers/JSX");
const ava_1 = require("ava");
const setup_1 = require("../helpers/setup");
const boolean_control_1 = require("../../src/renderers/controls/boolean.control");
const core_1 = require("../../src/core");
require("../helpers/setup");
const actions_1 = require("../../src/actions");
const inferno_test_utils_1 = require("inferno-test-utils");
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
    t.context.data = { 'foo': true };
    t.context.schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'boolean'
            }
        }
    };
    t.context.uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
});
ava_1.default('tester', t => {
    t.is(boolean_control_1.booleanControlTester(undefined, undefined), -1);
    t.is(boolean_control_1.booleanControlTester(null, undefined), -1);
    t.is(boolean_control_1.booleanControlTester({ type: 'Foo' }, undefined), -1);
    t.is(boolean_control_1.booleanControlTester({ type: 'Control' }, undefined), -1);
});
ava_1.default('tester with wrong prop type', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.is(boolean_control_1.booleanControlTester(control, { type: 'object', properties: { foo: { type: 'string' } } }), -1);
});
ava_1.default('tester with wrong prop type, but sibling has correct one', t => {
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
ava_1.default('tester with matching prop type', t => {
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
ava_1.default('render', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const control = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'control');
    t.not(control, undefined);
    t.is(control.childNodes.length, 3);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'valid'), undefined);
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, 'Foo');
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.is(input.type, 'checkbox');
    t.is(input.checked, true);
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
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: uischema })));
    const control = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'control');
    t.not(control, undefined);
    t.is(control.childNodes.length, 3);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'valid'), undefined);
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, '');
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.is(input.type, 'checkbox');
    t.is(input.checked, true);
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('update via input event', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    const evt = new Event('click', {
        'bubbles': true,
        'cancelable': true
    });
    input.dispatchEvent(evt);
    t.is(index_1.getData(store.getState()).foo, false);
});
ava_1.default('update via action', t => {
    const data = { 'foo': 13 };
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update('foo', () => false));
    t.is(input.checked, false);
    t.is(index_1.getData(store.getState()).foo, false);
});
ava_1.default('update with undefined value', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update('foo', () => undefined));
    t.is(input.value, '');
});
ava_1.default('update with null value', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update('foo', () => null));
    t.is(input.value, '');
});
ava_1.default('update with wrong ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update('bar', () => 11));
    t.is(input.checked, true);
});
ava_1.default('update with null ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update(null, () => 13));
    t.is(input.checked, true);
});
ava_1.default('update with undefined ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    store.dispatch(actions_1.update(undefined, () => 13));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.is(input.checked, true);
});
ava_1.default('hide', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: t.context.uischema, visible: false })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.true(input.hidden);
});
ava_1.default('show by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.false(input.hidden);
});
ava_1.default('disable', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: t.context.uischema, enabled: false })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.true(input.disabled);
});
ava_1.default('enabled by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.false(input.disabled);
});
ava_1.default('single error', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('foo', () => 2));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, 'should be boolean');
});
ava_1.default('multiple errors', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('foo', () => 3));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, 'should be boolean');
});
ava_1.default('empty errors by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.textContent, '');
});
ava_1.default('reset validation message', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(boolean_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('foo', () => 3));
    store.dispatch(actions_1.update('foo', () => true));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, '');
});
//# sourceMappingURL=boolean.control.test.js.map