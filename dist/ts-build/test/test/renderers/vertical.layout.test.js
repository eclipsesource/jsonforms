"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const JSX_1 = require("../../src/renderers/JSX");
const setup_1 = require("../helpers/setup");
const core_1 = require("../../src/core");
const vertical_layout_1 = require("../../src/renderers/layouts/vertical.layout");
const inferno_test_utils_1 = require("inferno-test-utils");
const inferno_redux_1 = require("inferno-redux");
ava_1.default.before(() => {
    core_1.JsonForms.stylingRegistry.registerMany([
        {
            name: 'vertical-layout',
            classNames: ['vertical-layout']
        }
    ]);
});
ava_1.default('tester', t => {
    t.is(vertical_layout_1.verticalLayoutTester(undefined, undefined), -1);
    t.is(vertical_layout_1.verticalLayoutTester(null, undefined), -1);
    t.is(vertical_layout_1.verticalLayoutTester({ type: 'Foo' }, undefined), -1);
    t.is(vertical_layout_1.verticalLayoutTester({ type: 'VerticalLayout' }, undefined), 1);
});
ava_1.default('render with undefined elements', t => {
    const uischema = {
        type: 'VerticalLayout'
    };
    const store = setup_1.initJsonFormsStore({}, {}, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(vertical_layout_1.default, { uischema: uischema })));
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'vertical-layout'), undefined);
});
ava_1.default('render with null elements', t => {
    const uischema = {
        type: 'VerticalLayout',
        elements: null
    };
    const store = setup_1.initJsonFormsStore({}, {}, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(vertical_layout_1.default, { uischema: uischema })));
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'vertical-layout'), undefined);
});
ava_1.default('render with children', t => {
    const uischema = {
        type: 'VerticalLayout',
        elements: [{ type: 'Control' }, { type: 'Control' }]
    };
    const store = setup_1.initJsonFormsStore({}, {}, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(vertical_layout_1.default, { uischema: uischema })));
    const verticalLayout = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'vertical-layout');
    t.is(verticalLayout.tagName, 'DIV');
    t.is(verticalLayout.children.length, 2);
});
ava_1.default('hide', t => {
    const uischema = {
        type: 'VerticalLayout',
        elements: [{ type: 'Control' }],
    };
    const store = setup_1.initJsonFormsStore({}, {}, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(vertical_layout_1.default, { uischema: uischema, visible: false })));
    const verticalLayout = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'vertical-layout');
    t.true(verticalLayout.hidden);
});
ava_1.default('show by default', t => {
    const uischema = {
        type: 'VerticalLayout',
        elements: [{ type: 'Control' }],
    };
    const store = setup_1.initJsonFormsStore({}, {}, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(vertical_layout_1.default, { uischema: uischema })));
    const verticalLayout = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'vertical-layout');
    t.false(verticalLayout.hidden);
});
//# sourceMappingURL=vertical.layout.test.js.map