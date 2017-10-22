"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../../src/renderers/JSX");
const ava_1 = require("ava");
const setup_1 = require("../helpers/setup");
const group_layout_1 = require("../../src/renderers/layouts/group.layout");
const core_1 = require("../../src/core");
const inferno_test_utils_1 = require("inferno-test-utils");
const inferno_redux_1 = require("inferno-redux");
ava_1.default.before(() => {
    core_1.JsonForms.stylingRegistry.registerMany([
        {
            name: 'group-layout',
            classNames: ['group-layout']
        }
    ]);
});
ava_1.default.beforeEach(t => {
    t.context.uischema = {
        type: 'GroupLayout',
        elements: [{ type: 'Control' }]
    };
});
ava_1.default('tester', t => {
    t.is(group_layout_1.groupTester(undefined, undefined), -1);
    t.is(group_layout_1.groupTester(null, undefined), -1);
    t.is(group_layout_1.groupTester({ type: 'Foo' }, undefined), -1);
    t.is(group_layout_1.groupTester({ type: 'Group' }, undefined), 1);
});
ava_1.default('render with label', t => {
    const uischema = {
        type: 'Group',
        label: 'Foo',
        elements: [],
    };
    const store = setup_1.initJsonFormsStore({}, {}, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(group_layout_1.default, { uischema: uischema })));
    const groupLayout = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'group-layout');
    t.is(groupLayout.tagName, 'DIV');
    t.is(groupLayout.className, 'group-layout');
    t.is(groupLayout.children.length, 1);
    const legend = groupLayout.children[0];
    t.is(legend.tagName, 'LEGEND');
    t.is(legend.textContent, 'Foo');
});
ava_1.default('render with null elements', t => {
    const uischema = {
        type: 'Group',
        elements: null
    };
    const store = setup_1.initJsonFormsStore({}, {}, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(group_layout_1.default, { uischema: uischema })));
    const groupLayout = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'group-layout');
    t.is(groupLayout.tagName, 'DIV');
    t.is(groupLayout.children.length, 0);
});
ava_1.default('render with children', t => {
    const uischema = {
        type: 'Group',
        elements: [
            { type: 'Control' },
            { type: 'Control' }
        ]
    };
    const store = setup_1.initJsonFormsStore({}, {}, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(group_layout_1.default, { uischema: uischema })));
    const groupLayout = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'group-layout');
    t.is(groupLayout.tagName, 'DIV');
    t.is(groupLayout.children.length, 2);
});
ava_1.default('hide', t => {
    const store = setup_1.initJsonFormsStore({}, {}, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(group_layout_1.default, { uischema: t.context.uischema, visible: false })));
    const groupLayout = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'group-layout');
    t.true(groupLayout.hidden);
});
ava_1.default('show by default', t => {
    const store = setup_1.initJsonFormsStore({}, {}, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(group_layout_1.default, { uischema: t.context.uischema })));
    const groupLayout = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'group-layout');
    t.false(groupLayout.hidden);
});
//# sourceMappingURL=group.layout.test.js.map