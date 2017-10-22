"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../../src/renderers/JSX");
const ava_1 = require("ava");
const inferno_redux_1 = require("inferno-redux");
const setup_1 = require("../helpers/setup");
const core_1 = require("../../src/core");
const label_renderer_1 = require("../../src/renderers/additional/label.renderer");
const inferno_test_utils_1 = require("inferno-test-utils");
ava_1.default.before(() => {
    core_1.JsonForms.stylingRegistry.registerMany([
        {
            name: 'label-control',
            classNames: ['jsf-label']
        }
    ]);
});
ava_1.default.beforeEach(t => {
    t.context.data = { 'name': 'Foo' };
    t.context.schema = { type: 'object', properties: { name: { type: 'string' } } };
    t.context.uischema = { type: 'Label', text: 'Bar' };
});
ava_1.default('tester', t => {
    t.is(label_renderer_1.labelRendererTester(undefined, undefined), -1);
    t.is(label_renderer_1.labelRendererTester(null, undefined), -1);
    t.is(label_renderer_1.labelRendererTester({ type: 'Foo' }, undefined), -1);
    t.is(label_renderer_1.labelRendererTester({ type: 'Label' }, undefined), 1);
});
ava_1.default('render with undefined text', t => {
    const uischema = { type: 'Label' };
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(label_renderer_1.default, { schema: t.context.schema, uischema: uischema })));
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.className, 'jsf-label');
    t.is(label.textContent, '');
});
ava_1.default('render with null text', t => {
    const uischema = {
        type: 'Label',
        text: null
    };
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(label_renderer_1.default, { schema: t.context.schema, uischema: uischema })));
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.className, 'jsf-label');
    t.is(label.textContent, '');
});
ava_1.default('render with text', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(label_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.className, 'jsf-label');
    t.is(label.childNodes.length, 1);
    t.is(label.textContent, 'Bar');
});
ava_1.default('hide', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(label_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema, visible: false })));
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    t.true(label.hidden);
});
ava_1.default('show by default', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(label_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const label = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'label');
    t.false(label.hidden);
});
//# sourceMappingURL=label.control.test.js.map