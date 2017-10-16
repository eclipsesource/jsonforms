import '../helpers/setup';
import test from 'ava';
import {
  JsonForms
} from '../../src/core';
import { JsonSchema } from '../../src/models/jsonSchema';
import {
  CANCEL_DND_ATTRIBUTE,
  dragAndDropAddHandler,
  dragAndDropEndHandler,
  dragAndDropRemoveHandler,
  dragAndDropStartHandler,
  dragAndDropUpdateHandler,
  DROP_TARGET_CSS,
  TreeNodeInfo
} from '../../src/renderers/additional/tree-renderer.dnd';
import * as _ from 'lodash';

test.beforeEach(t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      befores: {
        type: 'array',
        items : {
          type: 'object',
          id: 'a',
          properties: { id: {type: 'string'} }
        }
      },
      children: {
        type: 'array',
        items: {
          type: 'object',
          id: 'bar',
          properties: { name: {type: 'string'} }
        }
      }
    }
  };
  JsonForms.schema = schema;
  t.context.schema = schema;
});

test('TreeMasterDetailRenderer Drag And Drop - start handler', t => {
    const schema = t.context.schema;
    const id = 'testId';
    const root = document.createElement('div');
    const list1 = document.createElement('ul');
    const list2 = document.createElement('ul');
    const list3 = document.createElement('ul');
    root.appendChild(list1);
    root.appendChild(list2);
    root.appendChild(list3);

    list1.setAttribute('childrenIds', 'bar');
    list2.setAttribute('childrenIds', 'bar');
    list3.setAttribute('childrenIds', 'a');
    list2.classList.toggle(DROP_TARGET_CSS, true);
    const childSchema = schema.properties.children.items as JsonSchema;
    const tni = {
      data: {name: '1'},
      schema: childSchema,
      deleteFunction: null
    };

    const treeNodeMapping = new Map<HTMLLIElement, TreeNodeInfo>();
    const li =  document.createElement('li') as HTMLLIElement;
    treeNodeMapping.set(li, tni);
    dragAndDropStartHandler(root, treeNodeMapping)({ item: li });

    t.is(root.children.length, 3);
    t.true(list1.classList.contains(DROP_TARGET_CSS));
    t.true(list2.classList.contains(DROP_TARGET_CSS));
    t.false(list3.classList.contains(DROP_TARGET_CSS));
});

test('TreeMasterDetailRenderer Drag And Drop - end handler', t => {
    const id = 'testId';
    const root = document.createElement('div');
    const list1 = document.createElement('ul');
    const list2 = document.createElement('ul');
    const list3 = document.createElement('ul');
    root.appendChild(list1);
    root.appendChild(list2);
    root.appendChild(list3);

    list1.setAttribute('childrenIds', id);
    list1.classList.toggle(DROP_TARGET_CSS, true);
    list2.setAttribute('childrenIds', id);

    dragAndDropEndHandler(root)({});
    t.is(root.children.length, 3);
    t.false(list1.classList.contains(DROP_TARGET_CSS));
    t.false(list2.classList.contains(DROP_TARGET_CSS));
    t.false(list3.classList.contains(DROP_TARGET_CSS));
});

test('TreeMasterDetailRenderer Drag And Drop - update handler', t => {
  const schema: JsonSchema = t.context.schema;
  const data = {children: [{name: '1'}, {name: '2'}]};
  // build tree
  const liParent = document.createElement('li');
  const childrenUl = document.createElement('ul');
  childrenUl.setAttribute('childrenIds', 'bar');
  childrenUl.setAttribute('children', 'children');
  const li1 = document.createElement('li');
  const li2 = document.createElement('li');
  liParent.appendChild(childrenUl);

  // Append children in target order (after 'dnd')
  childrenUl.appendChild(li2);
  childrenUl.appendChild(li1);

  const childSchema = schema.properties.children.items as JsonSchema;
  const childrenProperty = JsonForms.schemaService.getContainmentProperties(schema)[0];
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
  const treeNodeMapping = new Map<HTMLLIElement, TreeNodeInfo>();
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

  dragAndDropUpdateHandler(treeNodeMapping)(forwardEvent);
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
  dragAndDropUpdateHandler(treeNodeMapping)(backwardEvent);
  t.is(data.children.length, 2);
  t.is(data.children[0].name, '1');
  t.is(data.children[1].name, '2');
});

test('TreeMasterDetailRenderer Drag And Drop - remove handler', t => {
  const schema: JsonSchema = t.context.schema;
  const data = {children: [{name: '1'}, {name: '2'}]};
  // build tree
  const liParent = document.createElement('li');
  const childrenUl = document.createElement('ul');
  childrenUl.setAttribute('childrenIds', 'bar');
  childrenUl.setAttribute('children', 'children');
  const li1 = document.createElement('li');
  const li2 = document.createElement('li');
  liParent.appendChild(childrenUl);

  // in the tree l1 is already deleted when the handler is called
  childrenUl.appendChild(li2);

  const childSchema = schema.properties.children.items as JsonSchema;
  const childrenProperty = JsonForms.schemaService.getContainmentProperties(schema)[0];
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
  const treeNodeMapping = new Map<HTMLLIElement, TreeNodeInfo>();
  treeNodeMapping.set(liParent, tniParent);
  treeNodeMapping.set(li1, tni1);
  treeNodeMapping.set(li2, tni2);
  const removeEvent = {
    from: childrenUl,
    oldIndex: 0,
    item: li1
  };

  dragAndDropRemoveHandler(treeNodeMapping)(removeEvent);
  t.is(data.children.length, 1);
  t.is(data.children[0].name, '2');
});

test('TreeMasterDetailRenderer Drag And Drop - remove handler - canceled add', t => {
  const schema: JsonSchema = t.context.schema;
  const data = {children: [{name: '1'}]};
  // build tree
  const liParent = document.createElement('li');
  const childrenUl = document.createElement('ul');
  childrenUl.setAttribute('childrenIds', 'bar');
  childrenUl.setAttribute('children', 'children');
  const li1 = document.createElement('li');
  liParent.appendChild(childrenUl);

  // in the tree l1 is already deleted when the handler is called
  const childSchema = schema.properties.children.items as JsonSchema;
  const childrenProperty = JsonForms.schemaService.getContainmentProperties(schema)[0];
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
  const treeNodeMapping = new Map<HTMLLIElement, TreeNodeInfo>();
  treeNodeMapping.set(liParent, tniParent);
  treeNodeMapping.set(li1, tni1);
  const removeEvent = {
    from: childrenUl,
    oldIndex: 0,
    item: li1
  };
  // simulate cancelled add
  li1.setAttribute(CANCEL_DND_ATTRIBUTE, '');

  dragAndDropRemoveHandler(treeNodeMapping)(removeEvent);
  // data was not changed
  t.is(data.children.length, 1);
  t.is(data.children[0].name, '1');
  // removed cancel attribute from affected li again
  t.false(li1.hasAttribute(CANCEL_DND_ATTRIBUTE));
  // removed li was re-inserted to original list
  t.is(childrenUl.children.length, 1);
  t.is(_.indexOf(childrenUl.children, li1), 0);
});

test('TreeMasterDetailRenderer Drag And Drop - add handler', t => {
  const schema: JsonSchema = t.context.schema;
  const data = {children: [{name: '2'}]};
  // build tree
  const liParent = document.createElement('li');
  const childrenUl = document.createElement('ul');
  childrenUl.setAttribute('childrenIds', 'bar');
  childrenUl.setAttribute('children', 'children');
  const li1 = document.createElement('li');
  const li2 = document.createElement('li');
  liParent.appendChild(childrenUl);

  // Append children in target order (after implied drag and drop)
  childrenUl.appendChild(li1);
  childrenUl.appendChild(li2);

  const childSchema = schema.properties.children.items as JsonSchema;
  const childrenProperty = JsonForms.schemaService.getContainmentProperties(schema)[0];
  const deleteFunction = childrenProperty.deleteFromData(data);
  const tniParent = {
    data: data,
    schema: schema,
    deleteFunction: null
  };
  const tni1 = {
    data: {name: '1'},
    schema: childSchema,
    deleteFunction: deleteFunction
  };
  const tni2 = {
    data: data.children[0],
    schema: childSchema,
    deleteFunction: deleteFunction
  };
  const treeNodeMapping = new Map<HTMLLIElement, TreeNodeInfo>();
  treeNodeMapping.set(liParent, tniParent);
  treeNodeMapping.set(li1, tni1);
  treeNodeMapping.set(li2, tni2);
  const addBeginning = {
    to: childrenUl,
    newIndex: 0,
    item: li1
  };

  dragAndDropAddHandler(treeNodeMapping)(addBeginning);
  t.is(data.children.length, 2);
  t.is(data.children[0].name, '1');
  t.is(data.children[1].name, '2');

  const li3 = document.createElement('li');
  const tni3 = {
    data: {name: '3'},
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

  dragAndDropAddHandler(treeNodeMapping)(addEnd);
  t.is(data.children.length, 3);
  t.is(data.children[0].name, '1');
  t.is(data.children[1].name, '2');
  t.is(data.children[2].name, '3');
});

test('TreeMasterDetailRenderer Drag And Drop - add handler - invalid drop target', t => {
  const schema: JsonSchema = t.context.schema;
  const data = {children: [{name: '1'}]};

  const addSchema: JsonSchema = {
    type: 'object',
    id: 'faraway',
    properties: {
      a: {type: 'string'}
    }
  };

  // build tree
  const liParent = document.createElement('li');
  const childrenUl = document.createElement('ul');
  childrenUl.setAttribute('childrenIds', 'bar');
  childrenUl.setAttribute('children', 'children');
  const liAdd = document.createElement('li');
  const li1 = document.createElement('li');
  liParent.appendChild(childrenUl);

  // Append children in target order (after implied drag and drop)
  childrenUl.appendChild(liAdd);
  childrenUl.appendChild(li1);

  const childSchema = schema.properties.children.items as JsonSchema;
  const childrenProperty = JsonForms.schemaService.getContainmentProperties(schema)[0];
  const deleteFunction = childrenProperty.deleteFromData(data);
  const tniParent = {
    data: data,
    schema: schema,
    deleteFunction: null
  };
  const tni1 = {
    data: {name: '1'},
    schema: childSchema,
    deleteFunction: deleteFunction
  };
  const tniAdd = {
    data: {a: 'new'},
    schema: addSchema,
    deleteFunction: null
  };
  const treeNodeMapping = new Map<HTMLLIElement, TreeNodeInfo>();
  treeNodeMapping.set(liParent, tniParent);
  treeNodeMapping.set(liAdd, tniAdd);
  treeNodeMapping.set(li1, tni1);
  const event = {
    to: childrenUl,
    newIndex: 0,
    item: liAdd
  };

  dragAndDropAddHandler(treeNodeMapping)(event);
  t.is(data.children.length, 1);
  t.is(data.children[0].name, '1');
  t.is(Object.keys(data).length, 1);
  t.true(liAdd.hasAttribute(CANCEL_DND_ATTRIBUTE));
});
