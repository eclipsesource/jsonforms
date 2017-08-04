"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:max-file-line-count */
const ava_1 = require("ava");
require("../helpers/setup");
const data_service_1 = require("../../src/core/data.service");
const tree_renderer_1 = require("../../src/renderers/additional/tree-renderer");
const base_control_tests_1 = require("./base.control.tests");
const core_1 = require("../../src/core");
ava_1.default.beforeEach(t => {
    t.context.data = {};
    t.context.schema = {
        type: 'object',
        properties: {}
    };
    t.context.uiSchema = {
        type: 'MasterDetailLayout',
        scope: { $ref: '#' }
    };
});
ava_1.default('TreeMasterDetailTester', t => {
    t.is(tree_renderer_1.treeMasterDetailTester(undefined, undefined), -1);
    t.is(tree_renderer_1.treeMasterDetailTester(null, undefined), -1);
    t.is(tree_renderer_1.treeMasterDetailTester({ type: 'MasterDetailLayout' }, undefined), -1);
});
ava_1.default('TreeMasterDetail tester with null $ref', t => {
    const control = {
        type: 'MasterDetailLayout',
        scope: {
            $ref: null
        }
    };
    t.is(tree_renderer_1.treeMasterDetailTester(control, undefined), -1);
});
ava_1.default('TreeMasterDetail tester matches', t => {
    const control = {
        type: 'MasterDetailLayout',
        scope: {
            $ref: '/properties/foo'
        }
    };
    t.is(tree_renderer_1.treeMasterDetailTester(control, undefined), 1);
});
ava_1.default('TreeMasterDetail tester with unknown type', t => {
    const control = {
        type: 'Foo',
        scope: { $ref: '/properties/foo' }
    };
    t.is(tree_renderer_1.treeMasterDetailTester(control, undefined), -1);
});
ava_1.default('TreeMasterDetail tester with null scope', t => {
    const masterDetailLayout = {
        type: 'MasterDetailLayout',
        scope: null
    };
    t.is(tree_renderer_1.treeMasterDetailTester(masterDetailLayout, undefined), -1);
});
ava_1.default('TreeMasterDetail tester with empty scope', t => {
    /*tslint:disable:no-object-literal-type-assertion */
    const masterDetailLayout = {
        type: 'MasterDetailLayout',
        scope: {}
    };
    /*tslint:enable:no-object-literal-type-assertion */
    t.is(tree_renderer_1.treeMasterDetailTester(masterDetailLayout, undefined), -1);
});
ava_1.default('TreeMasterDetail tester with scope, but null $ref', t => {
    const masterDetailLayout = {
        type: 'MasterDetailLayout',
        scope: {
            $ref: null
        }
    };
    t.is(tree_renderer_1.treeMasterDetailTester(masterDetailLayout, undefined), -1);
});
ava_1.default('TreeMasterDetail tester with regular ref', t => {
    const masterDetailLayout = {
        type: 'MasterDetailLayout',
        scope: {
            $ref: '/properties/foo'
        }
    };
    t.is(tree_renderer_1.treeMasterDetailTester(masterDetailLayout, undefined), 1);
});
ava_1.default('TreeMasterDetail tester with control of wrong type', t => {
    const unknownControl = {
        type: 'Foo',
        scope: { $ref: '/properties/foo' }
    };
    t.is(tree_renderer_1.treeMasterDetailTester(unknownControl, undefined), -1);
});
ava_1.default('TreeMasterDetailRenderer static object', t => {
    const schema = {
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
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: { $ref: '#' }
    };
    core_1.JsonForms.schema = schema;
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = { name: 'Foo', children: [{ name: 'Bar' }] };
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    const className = result.className;
    t.true(className.indexOf('jsf-treeMasterDetail') !== -1);
    t.is(result.childNodes.length, 3);
    // header
    const header = result.children[0];
    t.is(header.children.length, 1);
    const label = header.children[0];
    t.is(label.textContent, 'FooBar');
    // content
    const content = result.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    t.is(master.className, 'jsf-treeMasterDetail-master');
    t.is(master.children.length, 1);
    const ul = master.children[0];
    t.is(ul.children.length, 1);
    const li = ul.children[0];
    t.is(li.children.length, 2);
    // li label
    const div = li.children[0];
    t.is(div.children.length, 1);
    const span = div.children[0];
    t.is(span.className, 'label');
    t.is(span.children.length, 2);
    const spanLabel = span.children[0];
    t.is(spanLabel.textContent, 'Foo');
    const spanAdd = span.children[1];
    t.is(spanAdd.className, 'add');
    t.is(spanAdd.textContent, '\u2795');
    // li children
    const fooUL = li.children[1];
    t.is(fooUL.tagName, 'UL');
    t.is(fooUL.getAttribute('children'), 'children');
    const fooLI = fooUL.children[0];
    t.is(fooLI.children.length, 1);
    const divLI = fooLI.children[0];
    t.is(divLI.children.length, 1);
    const spanLI = divLI.children[0];
    t.is(spanLI.className, 'label');
    t.is(spanLI.children.length, 2);
    const spanLILabel = spanLI.children[0];
    t.is(spanLILabel.textContent, 'Bar');
    const spanLIDelete = spanLI.children[1];
    t.is(spanLIDelete.className, 'remove');
    t.is(spanLIDelete.textContent, '\u274C');
    // content -> detail
    const detail = content.children[1];
    t.is(detail.className, 'jsf-treeMasterDetail-detail');
    t.is(detail.children.length, 1);
    t.is(detail.children.item(0).tagName, 'JSON-FORMS');
    // dialog
    const dialog = result.children[2];
    t.is(dialog.children.length, 3);
    const dialogLabel = dialog.children[0];
    t.is(dialogLabel.tagName, 'LABEL');
    t.is(dialogLabel.innerText, 'Select the Item to create:');
    const dialogContent = dialog.children[1];
    t.is(dialogContent.tagName, 'DIV');
    t.is(dialogContent.className, 'content');
    const dialogClose = dialog.children[2];
    t.is(dialogClose.tagName, 'BUTTON');
    t.is(dialogClose.innerText, 'Close');
});
ava_1.default('TreeMasterDetailRenderer static array', t => {
    const schema = {
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
                            name: {
                                type: 'string'
                            }
                        }
                    }
                },
                name: { type: 'string' }
            }
        }
    };
    core_1.JsonForms.schema = schema;
    const uiSchema = {
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
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = [{ name: 'Foo', children: [{ name: 'Bar' }] }];
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    const className = result.className;
    t.true(className.indexOf('jsf-treeMasterDetail') !== -1);
    t.is(result.childNodes.length, 3);
    // header
    const header = result.children[0];
    t.is(header.children.length, 2);
    const label = header.children[0];
    t.is(label.textContent, 'FooBar');
    const rootButton = header.children[1];
    t.is(rootButton.textContent, 'Add to root');
    // content
    const content = result.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    t.is(master.className, 'jsf-treeMasterDetail-master');
    t.is(master.children.length, 1);
    const ul = master.children[0];
    t.is(ul.children.length, 1);
    const li = ul.children[0];
    t.is(li.children.length, 2);
    // li label
    const div = li.children[0];
    t.is(div.children.length, 2);
    const spanIcon = div.children[0];
    t.is(spanIcon.className, 'icon root');
    const span = div.children[1];
    t.is(span.className, 'label');
    t.is(span.children.length, 3);
    const spanLabel = span.children[0];
    t.is(spanLabel.textContent, 'Foo');
    const spanAdd = span.children[1];
    t.is(spanAdd.className, 'add');
    t.is(spanAdd.textContent, '\u2795');
    const spanDelete = span.children[2];
    t.is(spanDelete.className, 'remove');
    t.is(spanDelete.textContent, '\u274C');
    // li children
    const fooUL = li.children[1];
    t.is(fooUL.tagName, 'UL');
    t.is(fooUL.getAttribute('children'), 'children');
    t.is(fooUL.getAttribute('childrenId'), 'bar');
    const fooLI = fooUL.children[0];
    t.is(fooLI.children.length, 1);
    const divLI = fooLI.children[0];
    t.is(divLI.children.length, 2);
    const spanLIIcon = divLI.children[0];
    t.is(spanLIIcon.className, 'icon child');
    const spanLI = divLI.children[1];
    t.is(spanLI.className, 'label');
    t.is(spanLI.children.length, 2);
    const spanLILabel = spanLI.children[0];
    t.is(spanLILabel.textContent, 'Bar');
    const spanLIDelete = spanLI.children[1];
    t.is(spanLIDelete.className, 'remove');
    t.is(spanLIDelete.textContent, '\u274C');
    // content -> detail
    const detail = content.children[1];
    t.is(detail.className, 'jsf-treeMasterDetail-detail');
    t.is(detail.children.length, 1);
    t.is(detail.children.item(0).tagName, 'JSON-FORMS');
    // dialog
    const dialog = result.children[2];
    t.is(dialog.children.length, 3);
    const dialogLabel = dialog.children[0];
    t.is(dialogLabel.tagName, 'LABEL');
    t.is(dialogLabel.innerText, 'Select the Item to create:');
    const dialogContent = dialog.children[1];
    t.is(dialogContent.tagName, 'DIV');
    t.is(dialogContent.className, 'content');
    const dialogClose = dialog.children[2];
    t.is(dialogClose.tagName, 'BUTTON');
    t.is(dialogClose.innerText, 'Close');
});
ava_1.default('TreeMasterDetailRenderer static array not root', t => {
    const schema = {
        type: 'object', properties: {
            children: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string'
                        }
                    }
                }
            },
            name: { type: 'string' }
        }
    };
    core_1.JsonForms.schema = schema;
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = { name: 'Foo', children: [{ name: 'Bar' }] };
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: {
            $ref: '#/properties/children'
        },
        options: {}
    };
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    const className = result.className;
    t.true(className.indexOf('jsf-treeMasterDetail') !== -1);
    t.is(result.childNodes.length, 3);
    // header
    const header = result.children[0];
    t.is(header.children.length, 2);
    const label = header.children[0];
    t.is(label.textContent, 'FooBar');
    const rootButton = header.children[1];
    t.is(rootButton.textContent, 'Add to root');
    // content
    const content = result.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    t.is(master.className, 'jsf-treeMasterDetail-master');
    t.is(master.children.length, 1);
    const ul = master.children[0];
    t.is(ul.children.length, 1);
    const li = ul.children[0];
    t.is(li.children.length, 1);
    // li label
    const div = li.children[0];
    t.is(div.children.length, 1);
    const span = div.children[0];
    t.is(span.className, 'label');
    t.is(span.children.length, 2);
    const spanLabel = span.children[0];
    t.is(spanLabel.textContent, 'Bar');
    const spanDelete = span.children[1];
    t.is(spanDelete.className, 'remove');
    t.is(spanDelete.textContent, '\u274C');
    // content -> detail
    const detail = content.children[1];
    t.is(detail.className, 'jsf-treeMasterDetail-detail');
    t.is(detail.children.length, 1);
    t.is(detail.children.item(0).tagName, 'JSON-FORMS');
    // dialog
    const dialog = result.children[2];
    t.is(dialog.children.length, 3);
    const dialogLabel = dialog.children[0];
    t.is(dialogLabel.tagName, 'LABEL');
    t.is(dialogLabel.innerText, 'Select the Item to create:');
    const dialogContent = dialog.children[1];
    t.is(dialogContent.tagName, 'DIV');
    t.is(dialogContent.className, 'content');
    const dialogClose = dialog.children[2];
    t.is(dialogClose.tagName, 'BUTTON');
    t.is(dialogClose.innerText, 'Close');
});
ava_1.default('TreeMasterDetailRenderer dynamic select', t => {
    const schema = {
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
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: {
            $ref: '#'
        },
        options: {}
    };
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = [{ name: 'Foo', children: [{ name: 'Bar' }] }];
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    const className = result.className;
    t.true(className.indexOf('jsf-treeMasterDetail') !== -1);
    t.is(result.childNodes.length, 3);
    // content
    const content = result.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    const ul = master.children[0];
    const li = ul.children[0];
    // li children
    const fooUL = li.children[1];
    const liBar = fooUL.children[0];
    const divBar = liBar.children[0];
    const spanBar = divBar.children[0];
    // detail
    const detail = content.children[1];
    t.is(detail.children.length, 1);
    t.is(detail.children.item(0).tagName, 'JSON-FORMS');
    spanBar.click();
    t.is(detail.children.length, 1);
    t.is(detail.children.item(0).tagName, 'JSON-FORMS');
});
ava_1.default('TreeMasterDetailRenderer dynamic add array root', t => {
    const schema = {
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
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: {
            $ref: '#'
        },
        options: {}
    };
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = [{ name: 'Foo', children: [{ name: 'Bar' }] }];
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    const rootButton = result.children[0].children[1];
    // content
    const content = result.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    const ul = master.children[0];
    t.is(ul.children.length, 1);
    rootButton.click();
    t.is(ul.children.length, 2);
    const liNew = ul.children[1];
    const divNew = liNew.children[0];
    const spanNew = divNew.children[0];
    t.is(spanNew.children[0].textContent, '');
    t.is(data.length, 2);
});
ava_1.default('TreeMasterDetailRenderer dynamic remove added root', t => {
    const schema = {
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
    core_1.JsonForms.schema = schema;
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: {
            $ref: '#'
        },
        options: {}
    };
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = [{ name: 'Foo', children: [{ name: 'Bar' }] }];
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    const rootButton = result.children[0].children[1];
    // content
    const content = result.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    const ul = master.children[0];
    t.is(ul.children.length, 1);
    rootButton.click();
    t.is(ul.children.length, 2);
    const liNew = ul.children[1];
    const divNew = liNew.children[0];
    const spanNew = divNew.children[0];
    t.is(data.length, 2);
    const removeButton = spanNew.children[2];
    removeButton.click();
    t.is(data.length, 1);
});
ava_1.default('TreeMasterDetailRenderer dynamic add child to existing', t => {
    const schema = {
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
                        properties: { name: { type: 'string' } }
                    }
                },
                name: { type: 'string' }
            }
        }
    };
    core_1.JsonForms.schema = schema;
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: {
            $ref: '#'
        },
        options: {}
    };
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = [{ name: 'Foo', children: [{ name: 'Bar' }] }];
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    // content
    const content = result.children[1];
    const dialog = result.children[2];
    const dialogContent = dialog.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    const ul = master.children[0];
    const li = ul.children[0];
    const div = li.children[0];
    const span = div.children[0];
    const spanAdd = span.children[1];
    const fooUL = li.children[1];
    t.is(fooUL.children.length, 1);
    t.is(dialogContent.children.length, 0);
    spanAdd.click();
    // dialog opened
    t.is(dialogContent.children.length, 1);
    const addButton = dialogContent.children[0];
    t.is(addButton.innerText, 'children');
    addButton.click();
    // li children
    t.is(fooUL.children.length, 2);
    const liNew = fooUL.children[1];
    const divNew = liNew.children[0];
    const spanNew = divNew.children[0];
    t.is(spanNew.children[0].textContent, '');
    // TODO: can we fix the warning?
    /*tslint:disable:no-string-literal */
    t.is(data[0]['children'].length, 2);
    /*tslint:enable:no-string-literal */
});
ava_1.default('TreeMasterDetailRenderer dynamic remove root', t => {
    const schema = {
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
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: { $ref: '#' },
        options: {}
    };
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = [{ name: 'Foo' }];
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    // content
    const content = result.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    const ul = master.children[0];
    const li = ul.children[0];
    const div = li.children[0];
    const span = div.children[0];
    const spanRemove = span.children[2];
    spanRemove.click();
    // li children
    t.is(ul.children.length, 0);
    t.is(data.length, 0);
});
ava_1.default('TreeMasterDetailRenderer dynamic remove child from existing', t => {
    const schema = {
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
                        properties: { name: { type: 'string' } }
                    }
                },
                name: { type: 'string' }
            }
        }
    };
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: { $ref: '#' },
        options: {}
    };
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = [{ name: 'Foo', children: [{ name: 'Bar' }] }];
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    // content
    const content = result.children[1];
    const dialog = result.children[2];
    const dialogContent = dialog.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    const ul = master.children[0];
    const li = ul.children[0];
    const fooUL = li.children[1];
    t.is(fooUL.children.length, 1);
    t.is(dialogContent.children.length, 0);
    const liBar = fooUL.children[0];
    const divBar = liBar.children[0];
    const spanBar = divBar.children[0];
    const removeButton = spanBar.children[1];
    removeButton.click();
    // li children
    t.is(fooUL.children.length, 0);
    /*tslint:disable:no-string-literal */
    t.is(data[0]['children'].length, 0);
    /*tslint:enable:no-string-literal */
});
ava_1.default('TreeMasterDetailRenderer dynamic add child to empty', t => {
    const schema = {
        type: 'array',
        items: {
            type: 'object',
            id: 'foo',
            properties: {
                children: {
                    type: 'array', items: {
                        type: 'object', id: 'bar', properties: { name: { type: 'string' } }
                    }
                },
                name: { type: 'string' }
            }
        }
    };
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: {
            $ref: '#'
        },
        options: {}
    };
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = [{ name: 'Foo' }];
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    // content
    const content = result.children[1];
    const dialog = result.children[2];
    const dialogContent = dialog.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    const ul = master.children[0];
    const li = ul.children[0];
    const div = li.children[0];
    const span = div.children[0];
    const spanAdd = span.children[1];
    t.is(li.children.length, 2); // div and ul for children property
    t.is(dialogContent.children.length, 0);
    spanAdd.click();
    // dialog opened
    t.is(dialogContent.children.length, 1);
    const addButton = dialogContent.children[0];
    t.is(addButton.innerText, 'children');
    addButton.click();
    // li children
    t.is(li.children.length, 2); // add to existing list
    const fooUL = li.children[1]; // children list
    t.is(fooUL.children.length, 1);
    t.is(fooUL.getAttribute('children'), 'children');
    t.is(fooUL.getAttribute('childrenId'), 'bar');
    const liNew = fooUL.children[0];
    const divNew = liNew.children[0];
    const spanNew = divNew.children[0];
    t.is(spanNew.children[0].textContent, '');
    /*tslint:disable:no-string-literal */
    t.is(data[0]['children'].length, 1);
    /*tslint:enable:no-string-literal */
    // add second child
    spanAdd.click();
    // dialog opened
    t.is(dialogContent.children.length, 1);
    const addButton2 = dialogContent.children[0];
    t.is(addButton2.innerText, 'children');
    addButton2.click();
    // li children
    t.is(li.children.length, 2);
    const fooUL2 = li.children[1];
    t.is(fooUL2.children.length, 2);
    const liNew2 = fooUL2.children[0];
    const divNew2 = liNew2.children[0];
    const spanNew2 = divNew2.children[0];
    t.is(spanNew2.children[0].textContent, '');
    /*tslint:disable:no-string-literal */
    t.is(data[0]['children'].length, 2);
    /*tslint:enable:no-string-literal */
});
ava_1.default('TreeMasterDetailRenderer dynamic cancel add', t => {
    const schema = {
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
                        properties: { name: { type: 'string' } }
                    }
                },
                name: { type: 'string' }
            }
        }
    };
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: {
            $ref: '#'
        },
        options: {}
    };
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = [{ name: 'Foo' }];
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    // content
    const content = result.children[1];
    const dialog = result.children[2];
    const dialogContent = dialog.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    const ul = master.children[0];
    const li = ul.children[0];
    const div = li.children[0];
    const span = div.children[0];
    const spanAdd = span.children[1];
    t.is(li.children.length, 2); // div and ul for children property
    t.is(dialogContent.children.length, 0);
    spanAdd.click();
    // dialog opened
    t.is(dialogContent.children.length, 1);
    const addButton = dialogContent.children[0];
    t.is(addButton.innerText, 'children');
    // cancel dialog
    const dialogCancel = dialog.children[2];
    dialogCancel.click();
    // li children
    t.is(li.children.length, 2);
    /*tslint:disable:no-string-literal */
    t.is(data[0]['children'], undefined);
    /*tslint:enable:no-string-literal */
});
ava_1.default('TreeMasterDetailRenderer dynamic remove added child', t => {
    const schema = {
        type: 'array',
        items: {
            type: 'object',
            id: 'foo',
            properties: {
                children: {
                    type: 'array',
                    items: {
                        type: 'object', id: 'bar', properties: { name: { type: 'string' } }
                    }
                },
                name: { type: 'string' }
            }
        }
    };
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: { $ref: '#' },
        options: {}
    };
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = [{ name: 'Foo' }];
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    // content
    const content = result.children[1];
    const dialog = result.children[2];
    const dialogContent = dialog.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    const ul = master.children[0];
    const li = ul.children[0];
    const div = li.children[0];
    const span = div.children[0];
    const spanAdd = span.children[1];
    t.is(li.children.length, 2); // div and ul for children property
    t.is(dialogContent.children.length, 0);
    spanAdd.click();
    // dialog opened
    t.is(dialogContent.children.length, 1);
    const addButton = dialogContent.children[0];
    t.is(addButton.innerText, 'children');
    addButton.click();
    // li children
    t.is(li.children.length, 2);
    const fooUL = li.children[1];
    t.is(fooUL.children.length, 1);
    const liNew = fooUL.children[0];
    const divNew = liNew.children[0];
    const spanNew = divNew.children[0];
    t.is(spanNew.children[0].textContent, '');
    /*tslint:disable:no-string-literal */
    t.is(data[0]['children'].length, 1);
    /*tslint:enable:no-string-literal */
    const removeButton = spanNew.children[1];
    removeButton.click();
    /*tslint:disable:no-string-literal */
    t.is(data[0]['children'].length, 0);
    /*tslint:enable:no-string-literal */
});
ava_1.default('TreeMasterDetailRenderer dataService notification wrong ref', t => {
    const schema = {
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
    core_1.JsonForms.schema = schema;
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: { $ref: '#/properties/children' },
        options: {}
    };
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = { name: 'Foo', children: [{ name: 'Bar' }] };
    const dataService = new data_service_1.DataService(data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    renderer.connectedCallback();
    const content = renderer.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    const ul = master.children[0];
    t.is(ul.children.length, 1);
    dataService.notifyAboutDataChange({ scope: { $ref: '#/properties/name' } }, 'Bar');
    const ulNew = master.children[0];
    t.is(ulNew, ul);
    t.is(renderer.children.length, 3);
    t.is(master.children.length, 1);
    t.is(ul.children.length, 1);
});
ava_1.default('TreeMasterDetailRenderer dataService notification null ref', t => {
    const schema = {
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
    core_1.JsonForms.schema = schema;
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: { $ref: '#/properties/children' },
        options: {}
    };
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = { name: 'Foo', children: [{ name: 'Bar' }] };
    const dataService = new data_service_1.DataService(data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    renderer.connectedCallback();
    const content = renderer.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    const ul = master.children[0];
    t.is(ul.children.length, 1);
    dataService.notifyAboutDataChange(null, undefined);
    const ulNew = master.children[0];
    t.is(ulNew, ul);
    t.is(renderer.children.length, 3);
    t.is(master.children.length, 1);
    t.is(ul.children.length, 1);
});
ava_1.default('TreeMasterDetailRenderer dataService notification undefined ref', t => {
    const schema = {
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
    core_1.JsonForms.schema = schema;
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: { $ref: '#/properties/children' },
        options: {}
    };
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = { name: 'Foo', children: [{ name: 'Bar' }] };
    const dataService = new data_service_1.DataService(data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    renderer.connectedCallback();
    const content = renderer.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    const ul = master.children[0];
    t.is(ul.children.length, 1);
    dataService.notifyAboutDataChange(undefined, undefined);
    const ulNew = master.children[0];
    t.is(ulNew, ul);
    t.is(renderer.children.length, 3);
    t.is(master.children.length, 1);
    t.is(ul.children.length, 1);
});
ava_1.default('TreeMasterDetailRenderer dataService no notification after disconnect', t => {
    const schema = {
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
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: { $ref: '#/properties/children' },
        options: {}
    };
    core_1.JsonForms.schema = schema;
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = { name: 'Foo', children: [{ name: 'Bar' }] };
    const dataService = new data_service_1.DataService(data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const content = renderer.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    const ul = master.children[0];
    t.is(ul.children.length, 1);
    dataService.notifyAboutDataChange({
        scope: { $ref: '#/properties/children' }
    }, 'Bar');
    const ulNew = master.children[0];
    t.is(ulNew, ul);
    t.is(renderer.children.length, 3);
    t.is(master.children.length, 1);
    t.is(ul.children.length, 1);
});
ava_1.default('TreeMasterDetailRenderer dataService notification', t => {
    const schema = {
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
    core_1.JsonForms.schema = schema;
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: { $ref: '#/properties/children' },
        options: {}
    };
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = { name: 'Foo', children: [{ name: 'Bar' }] };
    const dataService = new data_service_1.DataService(data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    renderer.connectedCallback();
    const content = renderer.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    const ul = master.children[0];
    t.is(ul.children.length, 1);
    dataService.notifyAboutDataChange({
        scope: { $ref: '#/properties/children' }
    }, [
        { name: 'Bar' },
        { name: 'Doe' },
    ]);
    const ulNew = master.children[0];
    const equal = ul === ulNew;
    t.false(equal);
    t.is(renderer.children.length, 3);
    t.is(master.children.length, 1);
    t.is(ulNew.children.length, 2);
    t.is(ulNew.children[0].children[0].children[0].children[0].textContent, 'Bar');
    t.is(ulNew.children[1].children[0].children[0].children[0].textContent, 'Doe');
});
ava_1.default('TreeMasterDetailRenderer dataService notification value undefined', t => {
    const schema = {
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
    core_1.JsonForms.schema = schema;
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: { $ref: '#/properties/children' },
        options: {}
    };
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = { name: 'Foo', children: [{ name: 'Bar' }] };
    const dataService = new data_service_1.DataService(data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    renderer.connectedCallback();
    const content = renderer.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    const ul = master.children[0];
    t.is(ul.children.length, 1);
    dataService.notifyAboutDataChange({
        scope: { $ref: '#/properties/children' }
    }, undefined);
    const ulNew = master.children[0];
    const equal = ul === ulNew;
    t.false(equal);
    t.is(ulNew.children.length, 0);
});
ava_1.default('TreeMasterDetailRenderer dataService notification value null', t => {
    const schema = {
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
    core_1.JsonForms.schema = schema;
    const uiSchema = {
        type: 'MasterDetailLayout',
        label: 'FooBar',
        scope: { $ref: '#/properties/children' },
        options: {}
    };
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const data = { name: 'Foo', children: [{ name: 'Bar' }] };
    const dataService = new data_service_1.DataService(data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    renderer.connectedCallback();
    const content = renderer.children[1];
    // content -> master tree
    const master = content.children[0]; // <-- TODO needed?
    const ul = master.children[0];
    t.is(ul.children.length, 1);
    dataService.notifyAboutDataChange({
        scope: { $ref: '#/properties/children' }
    }, null);
    const ulNew = master.children[0];
    const equal = ul === ulNew;
    t.false(equal);
    t.is(ulNew.children.length, 0);
});
ava_1.default('TreeMasterDetailRenderer notify visible', t => {
    const schema = { type: 'object', properties: {} };
    core_1.JsonForms.schema = schema;
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    const treeMasterDetail = {
        type: 'MasterDetailLayout',
        scope: { $ref: '#' }
    };
    renderer.setDataService(new data_service_1.DataService({}));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(treeMasterDetail);
    renderer.connectedCallback();
    const runtime = treeMasterDetail.runtime;
    runtime.visible = false;
    t.is(renderer.hidden, true);
});
ava_1.default('TreeMasterDetailRenderer notify disabled', t => {
    core_1.JsonForms.schema = t.context.schema;
    const dataService = new data_service_1.DataService(t.context.data);
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.enabled = false;
    t.is(renderer.getAttribute('disabled'), 'true');
});
ava_1.default('TreeMasterDetailRenderer notify enabled', t => {
    core_1.JsonForms.schema = t.context.schema;
    const dataService = new data_service_1.DataService(t.context.data);
    const renderer = new tree_renderer_1.TreeMasterDetailRenderer();
    renderer.setDataService(dataService);
    renderer.setDataSchema(t.context.schema);
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.enabled = true;
    t.false(renderer.hasAttribute('disabled'));
});
ava_1.default('TreeMasterDetailRenderer disconnected no notify visible', t => {
    core_1.JsonForms.schema = t.context.schema;
    base_control_tests_1.testNotifyAboutVisibiltyWhenDisconnected(t, new tree_renderer_1.TreeMasterDetailRenderer());
});
//# sourceMappingURL=treemasterdetail.control.test.js.map