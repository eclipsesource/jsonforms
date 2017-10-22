"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../../src/renderers/JSX");
const setup_1 = require("../helpers/setup");
const ava_1 = require("ava");
const tree_renderer_1 = require("../../src/renderers/additional/tree-renderer");
const core_1 = require("../../src/core");
const inferno_test_utils_1 = require("inferno-test-utils");
const actions_1 = require("../../src/actions");
const inferno_redux_1 = require("inferno-redux");
ava_1.default.beforeEach(t => {
    t.context.data = { name: 'Foo', children: [{ name: 'Bar' }] };
    t.context.schema = {
        type: 'object',
        properties: {
            children: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' }
                    }
                }
            },
            name: { type: 'string' }
        }
    };
    t.context.uischema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: { $ref: '#/properties/children' },
        options: {}
    };
});
ava_1.default('tester - sanity checks', t => {
    t.is(tree_renderer_1.treeMasterDetailTester(undefined, undefined), -1);
    t.is(tree_renderer_1.treeMasterDetailTester(null, undefined), -1);
    t.is(tree_renderer_1.treeMasterDetailTester({ type: 'MasterDetailLayout' }, undefined), -1);
});
ava_1.default('tester', t => {
    t.is(tree_renderer_1.treeMasterDetailTester(t.context.uischema, undefined), 2);
});
ava_1.default('tester with unknown control', t => {
    const unknownControl = {
        type: 'Foo',
        scope: { $ref: '/properties/foo' }
    };
    t.is(tree_renderer_1.treeMasterDetailTester(unknownControl, undefined), -1);
});
ava_1.default('tester with null scope', t => {
    const masterDetailLayout = {
        type: 'MasterDetailLayout',
        scope: null
    };
    t.is(tree_renderer_1.treeMasterDetailTester(masterDetailLayout, undefined), -1);
});
ava_1.default('tester with empty scope', t => {
    const masterDetailLayout = {
        type: 'MasterDetailLayout',
        scope: {}
    };
    t.is(tree_renderer_1.treeMasterDetailTester(masterDetailLayout, undefined), -1);
});
ava_1.default('tester with null $ref', t => {
    const masterDetailLayout = {
        type: 'MasterDetailLayout',
        scope: { $ref: null }
    };
    t.is(tree_renderer_1.treeMasterDetailTester(masterDetailLayout, undefined), -1);
});
ava_1.default('update with wrong ref', t => {
    core_1.JsonForms.schema = t.context.schema;
    // TODO: can we shorten this?
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const result = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
    const content = result.children[1];
    const master = content.firstElementChild;
    const ul = master.firstElementChild;
    store.dispatch(actions_1.update('name', () => 'Bar'));
    t.is(result.children.length, 3);
    t.is(master.children.length, 1);
    t.is(ul.children.length, 1);
});
ava_1.default('update with null ref', t => {
    core_1.JsonForms.schema = t.context.schema;
    const data = { name: 'Foo', children: [{ name: 'Bar' }] };
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const ul = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'ul');
    store.dispatch(actions_1.update(null, () => undefined));
    t.is(ul.children.length, 1);
});
ava_1.default('update with undefined ref', t => {
    core_1.JsonForms.schema = t.context.schema;
    const data = { name: 'Foo', children: [{ name: 'Bar' }] };
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const result = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
    const content = result.children[1];
    const master = content.firstElementChild;
    const ul = master.firstElementChild;
    store.dispatch(actions_1.update(undefined, () => undefined));
    t.is(result.children.length, 3);
    t.is(master.children.length, 1);
    t.is(ul.children.length, 1);
});
ava_1.default('update via action', t => {
    core_1.JsonForms.schema = t.context.schema;
    const data = { name: 'Foo', children: [{ name: 'Bar' }] };
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const result = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
    const content = result.children[1];
    const master = content.firstElementChild;
    const ul = master.firstElementChild;
    store.dispatch(actions_1.update('children', () => [
        { name: 'Bar' },
        { name: 'Doe' },
    ]));
    const labels = inferno_test_utils_1.scryRenderedDOMElementsWithClass(tree, 'label');
    t.is(result.children.length, 3);
    t.is(master.children.length, 1);
    t.is(ul.children.length, 2);
    t.is(labels[0].firstElementChild.textContent, 'Bar');
    t.is(labels[1].firstElementChild.textContent, 'Doe');
});
ava_1.default('update with undefined value', t => {
    core_1.JsonForms.schema = t.context.schema;
    const data = { name: 'Foo', children: [{ name: 'Bar' }] };
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const result = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
    const content = result.children[1];
    const master = content.firstElementChild;
    const ul = master.firstElementChild;
    store.dispatch(actions_1.update('children', () => undefined));
    t.is(ul.children.length, 0);
});
ava_1.default('update with null value', t => {
    core_1.JsonForms.schema = t.context.schema;
    const data = { name: 'Foo', children: [{ name: 'Bar' }] };
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const result = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
    const content = result.children[1];
    const master = content.children[0];
    const ul = master.children[0];
    store.dispatch(actions_1.update('children', () => null));
    t.is(ul.children.length, 0);
});
ava_1.default('hide', t => {
    const data = {};
    const schema = { type: 'object', properties: {} };
    core_1.JsonForms.schema = schema;
    const uischema = {
        type: 'MasterDetailLayout',
        scope: { $ref: '#' },
    };
    const store = setup_1.initJsonFormsStore(data, schema, uischema);
    const vnode = JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: schema, uischema: uischema, visible: false }));
    const tree = inferno_test_utils_1.renderIntoDocument(vnode);
    const div = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
    t.true(div.hidden);
});
ava_1.default('visible by default', t => {
    const data = {};
    const schema = { type: 'object', properties: {} };
    core_1.JsonForms.schema = schema;
    const uischema = {
        type: 'MasterDetailLayout',
        scope: { $ref: '#' },
    };
    const store = setup_1.initJsonFormsStore(data, schema, uischema);
    const vnode = JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: schema, uischema: uischema }));
    const tree = inferno_test_utils_1.renderIntoDocument(vnode);
    const div = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
    t.false(div.hidden);
});
// TODO: divs have no disabled attribute
// test('TreeMasterDetailRenderer notify disabled', t => {
//   JsonForms.schema = t.context.schema;
//   const dataService = new DataService(t.context.data);
//   const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
//   renderer.setDataService(dataService);
//   renderer.setschema(t.context.schema);
//   renderer.setUiSchema(t.context.uiSchema);
//   renderer.connectedCallback();
//   const runtime = t.context.uiSchema.runtime as Runtime;
//   runtime.enabled = false;
//   const result = patchAndGetElement(renderer.render()).elm as HTMLElement;
//   t.is(result.getAttribute('disabled'), 'true');
// });
//# sourceMappingURL=treemasterdetail.common.test.js.map