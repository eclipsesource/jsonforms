"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../../src/renderers/JSX");
const inferno_test_utils_1 = require("inferno-test-utils");
const ava_1 = require("ava");
const core_1 = require("../../src/core");
const setup_1 = require("../helpers/setup");
const setup_2 = require("../helpers/setup");
const actions_1 = require("../../src/actions");
const number_control_1 = require("../../src/renderers/controls/number.control");
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
    t.context.data = { 'foo': 3.14 };
    t.context.schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'number',
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
    t.is(number_control_1.numberControlTester(undefined, undefined), -1);
    t.is(number_control_1.numberControlTester(null, undefined), -1);
    t.is(number_control_1.numberControlTester({ type: 'Foo' }, undefined), -1);
    t.is(number_control_1.numberControlTester({ type: 'Control' }, undefined), -1);
});
ava_1.default('tester with wrong schema type', t => {
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
ava_1.default('tester with wrong schema type, but sibling has correct one', t => {
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
ava_1.default('tester with machting schema type', t => {
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
ava_1.default('render', t => {
    const schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'number'
            }
        }
    };
    const store = setup_1.initJsonFormsStore({ 'foo': 3.14 }, schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(number_control_1.default, { schema: schema, uischema: t.context.uischema })));
    const control = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'control');
    t.not(control, undefined);
    t.is(control.childNodes.length, 3);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'valid'), undefined);
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, 'Foo');
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.is(input.type, 'number');
    t.is(input.step, '0.1');
    t.is(input.value, '3.14');
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('render without label', t => {
    const store = setup_1.initJsonFormsStore({ 'foo': 2.72 }, t.context.schema, t.context.uischema);
    const uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: false
    };
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(number_control_1.default, { schema: t.context.schema, uischema: uischema })));
    const control = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'control');
    t.not(control, undefined);
    t.is(control.childNodes.length, 3);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'valid'), undefined);
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, '');
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.is(input.type, 'number');
    t.is(input.step, '0.1');
    t.is(input.value, '2.72');
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.tagName, 'DIV');
    t.is(validation.children.length, 0);
});
ava_1.default('update via input event', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(number_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    input.value = '2.72';
    setup_2.dispatchInputEvent(input);
    t.is(index_1.getData(store.getState()).foo, 2.72);
});
ava_1.default('update via action', t => {
    const store = setup_1.initJsonFormsStore({ 'foo': 2.72 }, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(number_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.is(input.value, '2.72');
    store.dispatch(actions_1.update('foo', () => 3.14));
    t.is(input.value, '3.14');
});
ava_1.default('update with undefined value', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(number_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update('foo', () => undefined));
    t.is(input.value, '');
});
ava_1.default('update with null value', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(number_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update('foo', () => null));
    t.is(input.value, '');
});
ava_1.default('update with wrong ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(number_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update('bar', () => 11));
    t.is(input.value, '3.14');
});
ava_1.default('update with null ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(number_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    store.dispatch(actions_1.update(null, () => 2.72));
    t.is(input.value, '3.14');
});
ava_1.default('update with undefined ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(number_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    store.dispatch(actions_1.update(undefined, () => 13));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.is(input.value, '3.14');
});
ava_1.default('hide', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(number_control_1.default, { schema: t.context.schema, uischema: t.context.uischema, visible: false })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.true(input.hidden);
});
ava_1.default('show by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(number_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.false(input.hidden);
});
ava_1.default('disable', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(number_control_1.default, { schema: t.context.schema, uischema: t.context.uischema, enabled: false })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.true(input.disabled);
});
ava_1.default('enabled by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(number_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const input = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'input');
    t.false(input.disabled);
});
ava_1.default('single error', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(number_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
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
        JSX_1.JSX.createElement(number_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('foo', () => 3));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, 'should be >= 4\nshould be equal to one of the allowed values');
});
ava_1.default('empty errors by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(number_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.textContent, '');
});
ava_1.default('reset validation message', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(number_control_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const validation = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(actions_1.update('foo', () => 3));
    store.dispatch(actions_1.update('foo', () => 10));
    store.dispatch(actions_1.validate());
    t.is(validation.textContent, '');
});
//# sourceMappingURL=number.control.test.js.map