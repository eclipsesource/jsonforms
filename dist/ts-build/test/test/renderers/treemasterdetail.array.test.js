"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../../src/renderers/JSX");
const _ = require("lodash");
const setup_1 = require("../helpers/setup");
const ava_1 = require("ava");
const tree_renderer_1 = require("../../src/renderers/additional/tree-renderer");
const core_1 = require("../../src/core");
const inferno_test_utils_1 = require("inferno-test-utils");
const inferno_redux_1 = require("inferno-redux");
const index_1 = require("../../src/reducers/index");
ava_1.default.beforeEach(t => {
    t.context.data = {};
    t.context.schema = {
        type: 'array',
        items: {
            type: 'object',
            id: 'foo',
            properties: {
                children: {
                    type: 'array',
                    items: {
                        type: 'object',
                        id: 'bar',
                        properties: {
                            name: { type: 'string' }
                        }
                    }
                },
                name: { type: 'string' }
            }
        }
    };
    t.context.uischema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: {
            $ref: '#'
        },
        options: {}
    };
    // reset document
    while (document.body.children.length > 0) {
        document.body.children.item(0).remove();
    }
});
const openDialog = (tree) => {
    const openDialogSpan = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'add');
    openDialogSpan.click();
};
const closeDialog = (tree) => {
    const dialog = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'dialog');
    const dialogCloseButton = dialog.lastElementChild;
    dialogCloseButton.click();
};
const clickFirstDialogButton = (tree) => {
    const dialog = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'dialog');
    const dialogContent = _.head(dialog.getElementsByClassName('dialog-content'));
    const button = dialogContent.firstElementChild;
    button.click();
};
ava_1.default('render', t => {
    core_1.JsonForms.schema = t.context.schema;
    const uischema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: { $ref: '#' },
        options: {
            labelProvider: {
                foo: 'name',
                bar: 'name'
            },
            imageProvider: {
                foo: 'root',
                bar: 'child'
            }
        }
    };
    const data = [{ name: 'Foo', children: [{ name: 'Bar' }] }];
    const store = setup_1.initJsonFormsStore(data, t.context.schema, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { data: data, schema: t.context.schema, uischema: uischema })));
    const result = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
    const header = result.children[0];
    const content = result.children[1];
    const label = header.children[0];
    const rootButton = header.children[1];
    const master = content.children[0];
    const detail = content.children[1];
    const ul = master.firstElementChild;
    const li = ul.firstElementChild;
    const div = li.children[0];
    const fooUl = li.children[1];
    const spanIcon = div.children[0];
    const span = div.children[1];
    const spanLabel = span.children[0];
    const spanAdd = span.children[1];
    const spanDelete = span.children[2];
    const fooLi = fooUl.firstElementChild;
    const divLi = fooLi.firstElementChild;
    const spanLiIcon = divLi.children[0];
    const spanLi = divLi.children[1];
    const spanLiLabel = spanLi.children[0];
    const spanLiRemove = spanLi.children[1];
    const dialog = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'dialog');
    const dialogLabel = dialog.children[0];
    const dialogContent = dialog.children[1];
    const dialogClose = dialog.children[2];
    t.is(result.childNodes.length, 3);
    t.is(header.children.length, 2);
    t.is(label.textContent, 'FooBar');
    t.is(rootButton.textContent, 'Add to root');
    t.is(li.children.length, 2);
    t.is(master.className, 'jsf-treeMasterDetail-master');
    t.is(master.children.length, 1);
    t.is(ul.children.length, 1);
    t.is(div.children.length, 2);
    t.is(spanIcon.className, 'icon root');
    t.is(span.className, 'label');
    t.is(span.children.length, 3);
    t.is(spanLabel.textContent, 'Foo');
    t.is(spanAdd.className, 'add');
    t.is(spanAdd.textContent, '\u2795');
    t.is(spanDelete.className, 'remove');
    t.is(spanDelete.textContent, '\u274C');
    t.is(fooUl.tagName, 'UL');
    // TODO
    // t.is(fooUL.getAttribute('children'), 'children');
    // t.is(fooUL.getAttribute('childrenId'), 'bar');
    t.is(fooLi.children.length, 1);
    t.is(divLi.children.length, 2);
    t.is(spanLiIcon.className, 'icon child');
    t.is(spanLi.className, 'label');
    t.is(spanLi.children.length, 2);
    t.is(spanLiLabel.textContent, 'Bar');
    t.is(spanLiRemove.className, 'remove');
    t.is(spanLiRemove.textContent, '\u274C');
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
ava_1.default('select', t => {
    const data = [{ name: 'Foo', children: [{ name: 'Bar' }] }];
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const spanBar = _.last(inferno_test_utils_1.scryRenderedDOMElementsWithClass(tree, 'label'));
    const detail = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail-detail');
    spanBar.click();
    t.is(detail.children.length, 1);
    // TODO: additional asserts
});
ava_1.default('add to root', t => {
    const data = [{ name: 'Foo', children: [{ name: 'Bar' }] }];
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const rootButton = _.head(inferno_test_utils_1.scryRenderedDOMElementsWithTag(tree, 'button'));
    const ul = _.head(inferno_test_utils_1.scryRenderedDOMElementsWithTag(tree, 'ul'));
    rootButton.click();
    const liNew = ul.children[1];
    const divNew = liNew.firstElementChild;
    const spanNew = divNew.firstElementChild;
    t.is(ul.children.length, 2);
    t.is(spanNew.children[0].textContent, '');
    t.is(index_1.getData(store.getState()).length, 2);
});
ava_1.default('add to root and remove', t => {
    core_1.JsonForms.schema = t.context.schema;
    const data = [{ name: 'Foo', children: [{ name: 'Bar' }] }];
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const rootButton = _.head(inferno_test_utils_1.scryRenderedDOMElementsWithTag(tree, 'button'));
    const ul = _.head(inferno_test_utils_1.scryRenderedDOMElementsWithTag(tree, 'ul'));
    rootButton.click();
    const removeSpan = _.last(inferno_test_utils_1.scryRenderedDOMElementsWithClass(tree, 'remove'));
    removeSpan.click();
    t.is(ul.children.length, 1);
    t.is(index_1.getData(store.getState()).length, 1);
});
ava_1.default('add to nested data', t => {
    core_1.JsonForms.schema = t.context.schema;
    const data = [{ name: 'Foo', children: [{ name: 'Bar' }] }];
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    openDialog(tree);
    clickFirstDialogButton(tree);
    const fooUl = _.last(inferno_test_utils_1.scryRenderedDOMElementsWithTag(tree, 'ul'));
    const liNew = fooUl.children[1];
    const divNew = liNew.firstElementChild;
    const spanNew = divNew.firstElementChild;
    t.is(fooUl.children.length, 2);
    t.is(spanNew.children[0].textContent, '');
    t.is(index_1.getData(store.getState())[0].children.length, 2);
});
ava_1.default('remove from root', t => {
    core_1.JsonForms.schema = t.context.schema;
    const data = [{ name: 'Foo' }];
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const ul = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'ul');
    const spanRemove = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'remove');
    spanRemove.click();
    t.is(ul.children.length, 0);
    t.is(index_1.getData(store.getState()).length, 0);
});
ava_1.default('remove from nested data', t => {
    const data = [{ name: 'Foo', children: [{ name: 'Bar' }] }];
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const spanRemove = _.last(inferno_test_utils_1.scryRenderedDOMElementsWithClass(tree, 'remove'));
    spanRemove.click();
    const ul = _.head(inferno_test_utils_1.scryRenderedDOMElementsWithTag(tree, 'li'));
    const li = ul.firstElementChild;
    t.is(li.children.length, 1);
    t.is(index_1.getData(store.getState())[0].children.length, 0);
});
ava_1.default('add two nested children', t => {
    const data = [{ name: 'Foo' }];
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    // add first child
    openDialog(tree);
    clickFirstDialogButton(tree);
    // add second child
    openDialog(tree);
    clickFirstDialogButton(tree);
    const fooUl = _.last(inferno_test_utils_1.scryRenderedDOMElementsWithTag(tree, 'ul'));
    const spanNew = _.head(fooUl.getElementsByTagName('span'));
    t.is(fooUl.children.length, 2);
    t.is(spanNew.children[0].textContent, '');
    t.is(index_1.getData(store.getState())[0].children.length, 2);
});
ava_1.default('cancel dialog', t => {
    const data = [{ name: 'Foo' }];
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    openDialog(tree);
    closeDialog(tree);
    const li = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'li');
    // same length as before
    t.is(li.children.length, 1);
    t.false(_.has(_.head(store.getState().data), 'children'));
});
ava_1.default('add and remove child', t => {
    const data = [{ name: 'Foo' }];
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(tree_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    openDialog(tree);
    clickFirstDialogButton(tree);
    const removeButton = _.last(inferno_test_utils_1.scryRenderedDOMElementsWithClass(tree, 'remove'));
    removeButton.click();
    t.is(index_1.getData(store.getState())[0].children.length, 0);
});
//# sourceMappingURL=treemasterdetail.array.test.js.map