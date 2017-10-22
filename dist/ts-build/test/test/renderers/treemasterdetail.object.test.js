"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../../src/renderers/JSX");
const setup_1 = require("../helpers/setup");
const ava_1 = require("ava");
const tree_renderer_1 = require("../../src/renderers/additional/tree-renderer");
const core_1 = require("../../src/core");
const inferno_test_utils_1 = require("inferno-test-utils");
const inferno_redux_1 = require("inferno-redux");
ava_1.default.beforeEach(t => {
    t.context.data = {};
    t.context.schema = {
        type: 'object',
        properties: {
            children: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: { name: { type: 'string' } }
                }
            },
            name: { type: 'string' }
        }
    };
    t.context.uischema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: { $ref: '#' }
    };
    // reset document
    while (document.body.children.length > 0) {
        document.body.children.item(0).remove();
    }
});
ava_1.default('render object', t => {
    core_1.JsonForms.schema = t.context.schema;
    const data = { name: 'Foo', children: [{ name: 'Bar' }] };
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const result = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
    const header = result.firstElementChild;
    const label = header.firstElementChild;
    const master = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail-master');
    const ul = master.firstElementChild;
    const li = ul.firstElementChild;
    const div = li.firstElementChild;
    const span = div.firstElementChild;
    const spanLabel = span.children[0];
    const spanAdd = span.children[1];
    const fooUL = li.children[1];
    const fooLI = fooUL.firstElementChild;
    const divLI = fooLI.firstElementChild;
    const spanLI = divLI.children[0];
    const spanLILabel = spanLI.children[0];
    const spanLIDelete = spanLI.children[1];
    const detail = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail-detail');
    const dialog = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'dialog');
    const dialogLabel = dialog.children[0];
    const dialogContent = dialog.children[1];
    const dialogClose = dialog.children[2];
    t.is(label.textContent, 'FooBar');
    t.is(master.children.length, 1);
    t.is(ul.children.length, 1);
    t.is(li.children.length, 2);
    t.is(header.children.length, 1);
    t.is(div.children.length, 1);
    t.is(span.className, 'label');
    t.is(span.children.length, 2);
    t.is(spanLabel.textContent, 'Foo');
    t.is(spanAdd.className, 'add');
    t.is(spanAdd.textContent, '\u2795');
    t.is(fooUL.tagName, 'UL');
    // TODO
    // t.is(fooUL.getAttribute('children'), 'children');
    t.is(fooLI.children.length, 1);
    t.is(divLI.children.length, 1);
    t.is(spanLI.className, 'label');
    t.is(spanLI.children.length, 2);
    t.is(spanLILabel.textContent, 'Bar');
    t.is(spanLIDelete.className, 'remove');
    t.is(spanLIDelete.textContent, '\u274C');
    t.is(detail.children.length, 1);
    t.is(dialog.children.length, 3);
    t.is(dialogLabel.tagName, 'LABEL');
    t.is(dialogLabel.textContent, 'Select item to create');
    t.is(dialogContent.tagName, 'DIV');
    t.is(dialogContent.className, 'content');
    t.is(dialogClose.tagName, 'BUTTON');
    t.is(dialogClose.textContent, 'Close');
});
ava_1.default('render object with array', t => {
    core_1.JsonForms.schema = t.context.schema;
    const data = { name: 'Foo', children: [{ name: 'Bar' }] };
    const uischema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: {
            $ref: '#/properties/children'
        },
        options: {}
    };
    const store = setup_1.initJsonFormsStore(data, t.context.schema, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: uischema })));
    const result = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
    const header = result.children[0];
    const label = header.children[0];
    const rootButton = header.children[1];
    const content = result.children[1];
    const master = content.children[0];
    const ul = master.children[0];
    const li = ul.children[0];
    const div = li.children[0];
    const span = div.children[0];
    const spanLabel = span.children[0];
    const spanDelete = span.children[1];
    const detail = content.children[1];
    const dialog = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'dialog');
    const dialogLabel = dialog.children[0];
    const dialogContent = dialog.children[1];
    const dialogClose = dialog.children[2];
    t.is(result.childNodes.length, 3);
    t.is(header.children.length, 2);
    t.is(label.textContent, 'FooBar');
    t.is(rootButton.textContent, 'Add to root');
    t.is(master.className, 'jsf-treeMasterDetail-master');
    t.is(master.children.length, 1);
    t.is(ul.children.length, 1);
    t.is(li.children.length, 1);
    t.is(div.children.length, 1);
    t.is(span.className, 'label');
    t.is(span.children.length, 2);
    t.is(spanLabel.textContent, 'Bar');
    t.is(spanDelete.className, 'remove');
    t.is(spanDelete.textContent, '\u274C');
    t.is(detail.className, 'jsf-treeMasterDetail-detail');
    t.is(detail.children.length, 1);
    t.is(dialog.children.length, 3);
    t.is(dialogLabel.tagName, 'LABEL');
    t.is(dialogLabel.textContent, 'Select item to create');
    t.is(dialogContent.tagName, 'DIV');
    t.is(dialogContent.className, 'content');
    t.is(dialogClose.tagName, 'BUTTON');
    t.is(dialogClose.textContent, 'Close');
});
//# sourceMappingURL=treemasterdetail.object.test.js.map