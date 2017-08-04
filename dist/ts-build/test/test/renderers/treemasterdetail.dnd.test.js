"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../helpers/setup");
const ava_1 = require("ava");
const core_1 = require("../../src/core");
const tree_renderer_dnd_1 = require("../../src/renderers/additional/tree-renderer.dnd");
ava_1.default.beforeEach(t => {
    const schema = {
        type: 'object',
        properties: {
            befores: {
                type: 'array',
                items: {
                    type: 'object',
                    id: 'a',
                    properties: { id: { type: 'string' } }
                }
            },
            children: {
                type: 'array',
                items: {
                    type: 'object',
                    id: 'bar',
                    properties: { name: { type: 'string' } }
                }
            }
        }
    };
    core_1.JsonForms.schema = schema;
    t.context.schema = schema;
});
ava_1.default('TreeMasterDetailRenderer Drag And Drop - update handler', t => {
    const schema = t.context.schema;
    const data = { children: [{ name: '1' }, { name: '2' }] };
    // build tree
    const liParent = document.createElement('li');
    const childrenUl = document.createElement('ul');
    childrenUl.setAttribute('childrenId', 'bar');
    childrenUl.setAttribute('children', 'children');
    const li1 = document.createElement('li');
    const li2 = document.createElement('li');
    liParent.appendChild(childrenUl);
    // Append children in target order (after 'dnd')
    childrenUl.appendChild(li2);
    childrenUl.appendChild(li1);
    const childSchema = schema.properties.children.items;
    const childrenProperty = core_1.JsonForms.schemaService.getContainmentProperties(schema)[0];
    const deleteFunction = childrenProperty.deleteFromData(data);
    const tniParent = {
        data: data,
        schema: schema,
        deleteFunction: null
    };
    const tni1 = {
        data: data.children[0],
        schema: childSchema,
        deleteFunction: deleteFunction
    };
    const tni2 = {
        data: data.children[1],
        schema: childSchema,
        deleteFunction: deleteFunction
    };
    const treeNodeMapping = new Map();
    treeNodeMapping.set(liParent, tniParent);
    treeNodeMapping.set(li1, tni1);
    treeNodeMapping.set(li2, tni2);
    const forwardEvent = {
        from: childrenUl,
        to: childrenUl,
        oldIndex: 0,
        newIndex: 1,
        item: li1
    };
    tree_renderer_dnd_1.dragAndDropUpdateHandler(treeNodeMapping)(forwardEvent);
    t.is(data.children.length, 2);
    t.is(data.children[0].name, '2');
    t.is(data.children[1].name, '1');
    const backwardEvent = {
        from: childrenUl,
        to: childrenUl,
        oldIndex: 1,
        newIndex: 0,
        item: li1
    };
    childrenUl.removeChild(li1);
    childrenUl.removeChild(li2);
    childrenUl.appendChild(li1);
    childrenUl.appendChild(li2);
    tree_renderer_dnd_1.dragAndDropUpdateHandler(treeNodeMapping)(backwardEvent);
    t.is(data.children.length, 2);
    t.is(data.children[0].name, '1');
    t.is(data.children[1].name, '2');
});
ava_1.default('TreeMasterDetailRenderer Drag And Drop - remove handler', t => {
    const schema = t.context.schema;
    const data = { children: [{ name: '1' }, { name: '2' }] };
    // build tree
    const liParent = document.createElement('li');
    const childrenUl = document.createElement('ul');
    childrenUl.setAttribute('childrenId', 'bar');
    childrenUl.setAttribute('children', 'children');
    const li1 = document.createElement('li');
    const li2 = document.createElement('li');
    liParent.appendChild(childrenUl);
    // in the tree l1 is already deleted when the handler is called
    childrenUl.appendChild(li2);
    const childSchema = schema.properties.children.items;
    const childrenProperty = core_1.JsonForms.schemaService.getContainmentProperties(schema)[0];
    const deleteFunction = childrenProperty.deleteFromData(data);
    const tniParent = {
        data: data,
        schema: schema,
        deleteFunction: null
    };
    const tni1 = {
        data: data.children[0],
        schema: childSchema,
        deleteFunction: deleteFunction
    };
    const tni2 = {
        data: data.children[1],
        schema: childSchema,
        deleteFunction: deleteFunction
    };
    const treeNodeMapping = new Map();
    treeNodeMapping.set(liParent, tniParent);
    treeNodeMapping.set(li1, tni1);
    treeNodeMapping.set(li2, tni2);
    const removeEvent = {
        from: childrenUl,
        oldIndex: 0,
        item: li1
    };
    tree_renderer_dnd_1.dragAndDropRemoveHandler(treeNodeMapping)(removeEvent);
    t.is(data.children.length, 1);
    t.is(data.children[0].name, '2');
});
ava_1.default('TreeMasterDetailRenderer Drag And Drop - add handler', t => {
    const schema = t.context.schema;
    const data = { children: [{ name: '2' }] };
    // build tree
    const liParent = document.createElement('li');
    const childrenUl = document.createElement('ul');
    childrenUl.setAttribute('childrenId', 'bar');
    childrenUl.setAttribute('children', 'children');
    const li1 = document.createElement('li');
    const li2 = document.createElement('li');
    liParent.appendChild(childrenUl);
    // Append children in target order (after implied drag and drop)
    childrenUl.appendChild(li1);
    childrenUl.appendChild(li2);
    const childSchema = schema.properties.children.items;
    const childrenProperty = core_1.JsonForms.schemaService.getContainmentProperties(schema)[0];
    const deleteFunction = childrenProperty.deleteFromData(data);
    const tniParent = {
        data: data,
        schema: schema,
        deleteFunction: null
    };
    const tni1 = {
        data: { name: '1' },
        schema: childSchema,
        deleteFunction: deleteFunction
    };
    const tni2 = {
        data: data.children[0],
        schema: childSchema,
        deleteFunction: deleteFunction
    };
    const treeNodeMapping = new Map();
    treeNodeMapping.set(liParent, tniParent);
    treeNodeMapping.set(li1, tni1);
    treeNodeMapping.set(li2, tni2);
    const addBeginning = {
        to: childrenUl,
        newIndex: 0,
        item: li1
    };
    tree_renderer_dnd_1.dragAndDropAddHandler(treeNodeMapping)(addBeginning);
    t.is(data.children.length, 2);
    t.is(data.children[0].name, '1');
    t.is(data.children[1].name, '2');
    const li3 = document.createElement('li');
    const tni3 = {
        data: { name: '3' },
        schema: childSchema,
        deleteFunction: null
    };
    treeNodeMapping.set(li3, tni3);
    childrenUl.appendChild(li3);
    const addEnd = {
        to: childrenUl,
        newIndex: 2,
        item: li3
    };
    tree_renderer_dnd_1.dragAndDropAddHandler(treeNodeMapping)(addEnd);
    t.is(data.children.length, 3);
    t.is(data.children[0].name, '1');
    t.is(data.children[1].name, '2');
    t.is(data.children[2].name, '3');
});
ava_1.default('TreeMasterDetailRenderer Drag And Drop - add handler - missing target property', t => {
    const schema = t.context.schema;
    const data = { children: [{ name: '1' }] };
    const addSchema = {
        type: 'object',
        id: 'faraway',
        properties: {
            a: { type: 'string' }
        }
    };
    // build tree
    const liParent = document.createElement('li');
    const childrenUl = document.createElement('ul');
    childrenUl.setAttribute('childrenId', 'bar');
    childrenUl.setAttribute('children', 'children');
    const liAdd = document.createElement('li');
    const li1 = document.createElement('li');
    liParent.appendChild(childrenUl);
    // Append children in target order (after implied drag and drop)
    childrenUl.appendChild(li1);
    const childSchema = schema.properties.children.items;
    const childrenProperty = core_1.JsonForms.schemaService.getContainmentProperties(schema)[0];
    const deleteFunction = childrenProperty.deleteFromData(data);
    const tniParent = {
        data: data,
        schema: schema,
        deleteFunction: null
    };
    const tni1 = {
        data: { name: '1' },
        schema: childSchema,
        deleteFunction: deleteFunction
    };
    const tniAdd = {
        data: { a: 'new' },
        schema: addSchema,
        deleteFunction: null
    };
    const treeNodeMapping = new Map();
    treeNodeMapping.set(liParent, tniParent);
    treeNodeMapping.set(liAdd, tniAdd);
    treeNodeMapping.set(li1, tni1);
    const event = {
        to: childrenUl,
        newIndex: 0,
        item: liAdd
    };
    tree_renderer_dnd_1.dragAndDropAddHandler(treeNodeMapping)(event);
    t.is(data.children.length, 1);
    t.is(data.children[0].name, '1');
    t.is(Object.keys(data).length, 1);
});
//# sourceMappingURL=treemasterdetail.dnd.test.js.map