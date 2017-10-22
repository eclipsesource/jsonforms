"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../../src/renderers/JSX");
const ava_1 = require("ava");
const setup_1 = require("../helpers/setup");
const core_1 = require("../../src/core");
const horizontal_layout_1 = require("../../src/renderers/layouts/horizontal.layout");
const inferno_test_utils_1 = require("inferno-test-utils");
const inferno_redux_1 = require("inferno-redux");
ava_1.default.before(() => {
    core_1.JsonForms.stylingRegistry.registerMany([
        {
            name: 'horizontal-layout',
            classNames: ['horizontal-layout']
        }
    ]);
});
ava_1.default.beforeEach(t => {
    t.context.uischema = {
        type: 'HorizontalLayout',
        elements: [{ type: 'Control' }]
    };
});
ava_1.default('tester', t => {
    t.is(horizontal_layout_1.horizontalLayoutTester(undefined, undefined), -1);
    t.is(horizontal_layout_1.horizontalLayoutTester(null, undefined), -1);
    t.is(horizontal_layout_1.horizontalLayoutTester({ type: 'Foo' }, undefined), -1);
    t.is(horizontal_layout_1.horizontalLayoutTester({ type: 'HorizontalLayout' }, undefined), 1);
});
ava_1.default('render with undefined elements', t => {
    const uischema = {
        type: 'HorizontalLayout'
    };
    const store = setup_1.initJsonFormsStore({}, {}, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(horizontal_layout_1.default, { uischema: uischema })));
    const horizontalLayout = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'horizontal-layout');
    t.not(horizontalLayout, undefined);
    t.is(horizontalLayout.children.length, 0);
});
ava_1.default('render with null elements', t => {
    const uischema = {
        type: 'HorizontalLayout',
        elements: null
    };
    const store = setup_1.initJsonFormsStore({}, {}, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(horizontal_layout_1.default, { uischema: uischema })));
    const horizontalLayout = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'horizontal-layout');
    t.not(horizontalLayout, undefined);
    t.is(horizontalLayout.children.length, 0);
});
ava_1.default('render with children', t => {
    const uischema = {
        type: 'HorizontalLayout',
        elements: [
            { type: 'Control' },
            { type: 'Control' }
        ]
    };
    const store = setup_1.initJsonFormsStore({}, {}, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(horizontal_layout_1.default, { uischema: uischema })));
    const horizontalLayout = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'horizontal-layout');
    t.not(horizontalLayout, undefined);
    t.is(horizontalLayout.children.length, 2);
});
ava_1.default('hide', t => {
    const store = setup_1.initJsonFormsStore({}, {}, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(horizontal_layout_1.default, { uischema: t.context.uischema, visible: false })));
    const horizontalLayout = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'horizontal-layout');
    t.true(horizontalLayout.hidden);
});
ava_1.default('show by default', t => {
    const store = setup_1.initJsonFormsStore({}, {}, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(horizontal_layout_1.default, { uischema: t.context.uischema })));
    const horizontalLayout = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'horizontal-layout');
    t.false(horizontalLayout.hidden);
});
//# sourceMappingURL=horizontal.layout.test.js.map