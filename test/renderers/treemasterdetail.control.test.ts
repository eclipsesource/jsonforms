import test from 'ava';
// inject window, document etc.
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare var global;
installCE(global, 'force');
import {JsonSchema} from '../../src/models/jsonSchema';
import {ControlElement} from '../../src/models/uischema';
import {TreeMasterDetailRenderer, treeMasterDetailTester}
  from '../../src/renderers/additional/tree-renderer';
import {DataService } from '../../src/core/data.service';
import {JsonForms} from '../../src/core';
import {JsonFormsElement} from '../../src/json-forms';
import {Runtime} from '../../src/core/runtime';

test('TreeMasterDetailTester', t => {
  t.is(treeMasterDetailTester(undefined, undefined), -1);
  t.is(treeMasterDetailTester(null, undefined), -1);
  t.is(treeMasterDetailTester({type: 'Foo'}, undefined), -1);
  t.is(treeMasterDetailTester({type: 'MasterDetailLayout'}, undefined), -1);
  t.is(treeMasterDetailTester({type: 'MasterDetailLayout', scope: null} as ControlElement,
    undefined), -1);
  t.is(treeMasterDetailTester({type: 'MasterDetailLayout', scope: {}} as ControlElement,
    undefined), -1);
  t.is(treeMasterDetailTester({type: 'MasterDetailLayout', scope: {$ref: null}} as ControlElement,
    undefined), -1);
  t.is(treeMasterDetailTester(
    {type: 'MasterDetailLayout', scope: {$ref: '/properties/foo'}} as ControlElement,
    undefined), 1);
  t.is(treeMasterDetailTester(
    {type: 'Foo', scope: {$ref: '/properties/foo'}} as ControlElement,
    undefined), -1);
});
test('TreeMasterDetailRenderer static object', t => {
  const schema = {type: 'object', properties: {
    children: {type: 'array', items: {
      type: 'object', properties: { name: {type: 'string'}}}},
    name: {type: 'string'}
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = {name: 'Foo', children: [{name: 'Bar'}]};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar',
    scope: {$ref: '#'}} as ControlElement);
  const result = renderer.render();
  t.is(result.className, 'jsf-treeMasterDetail')
  t.is(result.childNodes.length, 3);
  // header
  const header = <HTMLDivElement>result.children[0];
  t.is(header.children.length, 1);
  const label = <HTMLLabelElement>header.children[0];
  t.is(label.textContent, 'FooBar');
  // content
  const content = <HTMLDivElement>result.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
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
  const detail = <HTMLDivElement>content.children[1];
  t.is(detail.className, 'jsf-treeMasterDetail-detail');
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'JSON-FORMS');

  // dialog
  const dialog = result.children[2];
  t.is(dialog.children.length, 3);
  const dialogLabel = <HTMLLabelElement>dialog.children[0];
  t.is(dialogLabel.tagName, 'LABEL');
  t.is(dialogLabel.innerText, 'Select the Item to create:');
  const dialogContent = <HTMLDivElement>dialog.children[1];
  t.is(dialogContent.tagName, 'DIV');
  t.is(dialogContent.className, 'content');
  const dialogClose = <HTMLButtonElement>dialog.children[2];
  t.is(dialogClose.tagName, 'BUTTON');
  t.is(dialogClose.innerText, 'Close');
});

test('TreeMasterDetailRenderer static array', t => {
  const schema = {type: 'array', items: {
    type: 'object', id: 'foo', properties: {
      children: {type: 'array', items: {
        type: 'object', id: 'bar', properties: { name: {type: 'string'}}}},
        name: {type: 'string'}
    }
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = [{name: 'Foo', children: [{name: 'Bar'}]}];
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar', scope: {$ref: '#'},
  options: {labelProvider: {foo: 'name', bar: 'name'},
    imageProvider: {foo: 'root', bar: 'child'}}} as ControlElement);
  const result = renderer.render();
  t.is(result.className, 'jsf-treeMasterDetail')
  t.is(result.childNodes.length, 3);
  // header
  const header = <HTMLDivElement>result.children[0];
  t.is(header.children.length, 2);
  const label = <HTMLLabelElement>header.children[0];
  t.is(label.textContent, 'FooBar');
  const rootButton = <HTMLButtonElement>header.children[1];
  t.is(rootButton.textContent, 'Add to root');
  // content
  const content = <HTMLDivElement>result.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
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
  const detail = <HTMLDivElement>content.children[1];
  t.is(detail.className, 'jsf-treeMasterDetail-detail');
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'JSON-FORMS');

  // dialog
  const dialog = result.children[2];
  t.is(dialog.children.length, 3);
  const dialogLabel = <HTMLLabelElement>dialog.children[0];
  t.is(dialogLabel.tagName, 'LABEL');
  t.is(dialogLabel.innerText, 'Select the Item to create:');
  const dialogContent = <HTMLDivElement>dialog.children[1];
  t.is(dialogContent.tagName, 'DIV');
  t.is(dialogContent.className, 'content');
  const dialogClose = <HTMLButtonElement>dialog.children[2];
  t.is(dialogClose.tagName, 'BUTTON');
  t.is(dialogClose.innerText, 'Close');
});
test('TreeMasterDetailRenderer static array not root', t => {
  const schema = {type: 'object', properties: {
      children: {type: 'array', items: {
        type: 'object', properties: { name: {type: 'string'}}}},
      name: {type: 'string'}
    }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = {name: 'Foo', children: [{name: 'Bar'}]};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar',
  scope: {$ref: '#/properties/children'}, options: {}} as ControlElement);
  const result = renderer.render();
  t.is(result.className, 'jsf-treeMasterDetail')
  t.is(result.childNodes.length, 3);
  // header
  const header = <HTMLDivElement>result.children[0];
  t.is(header.children.length, 2);
  const label = <HTMLLabelElement>header.children[0];
  t.is(label.textContent, 'FooBar');
  const rootButton = <HTMLButtonElement>header.children[1];
  t.is(rootButton.textContent, 'Add to root');
  // content
  const content = <HTMLDivElement>result.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
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
  const detail = <HTMLDivElement>content.children[1];
  t.is(detail.className, 'jsf-treeMasterDetail-detail');
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'JSON-FORMS');

  // dialog
  const dialog = result.children[2];
  t.is(dialog.children.length, 3);
  const dialogLabel = <HTMLLabelElement>dialog.children[0];
  t.is(dialogLabel.tagName, 'LABEL');
  t.is(dialogLabel.innerText, 'Select the Item to create:');
  const dialogContent = <HTMLDivElement>dialog.children[1];
  t.is(dialogContent.tagName, 'DIV');
  t.is(dialogContent.className, 'content');
  const dialogClose = <HTMLButtonElement>dialog.children[2];
  t.is(dialogClose.tagName, 'BUTTON');
  t.is(dialogClose.innerText, 'Close');
});

test('TreeMasterDetailRenderer dynamic select', t => {
  const schema = {type: 'array', items: {
    type: 'object', id: 'foo', properties: {
      children: {type: 'array', items: {
        type: 'object', id: 'bar', properties: { name: {type: 'string'}}}},
        name: {type: 'string'}
    }
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = [{name: 'Foo', children: [{name: 'Bar'}]}];
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar', scope: {$ref: '#'},
  options: {}} as ControlElement);
  const result = renderer.render();
  t.is(result.className, 'jsf-treeMasterDetail')
  t.is(result.childNodes.length, 3);
  // content
  const content = <HTMLDivElement>result.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
  const ul = master.children[0];
  const li = ul.children[0];
  const div = li.children[0];
  const span = <HTMLSpanElement>div.children[0];
  // li children
  const fooUL = li.children[1];
  const liBar = fooUL.children[0];
  const divBar = liBar.children[0];
  const spanBar = <HTMLSpanElement>divBar.children[0];

  // detail
  const detail = <HTMLDivElement>content.children[1];
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'JSON-FORMS');

  spanBar.click();
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'JSON-FORMS');
});

test('TreeMasterDetailRenderer dynamic add array root', t => {
  const schema = {type: 'array', items: {
    type: 'object', id: 'foo', properties: {
      children: {type: 'array', items: {
        type: 'object', id: 'bar', properties: { name: {type: 'string'}}}},
        name: {type: 'string'}
    }
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = [{name: 'Foo', children: [{name: 'Bar'}]}];
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar', scope: {$ref: '#'},
  options: {}} as ControlElement);
  const result = renderer.render();
  const rootButton = <HTMLButtonElement>result.children[0].children[1];
  // content
  const content = <HTMLDivElement>result.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
  const ul = master.children[0];
  t.is(ul.children.length, 1);
  const li = ul.children[0];
  const div = li.children[0];
  const span = <HTMLSpanElement>div.children[0];

  rootButton.click();
  t.is(ul.children.length, 2);
  const liNew = ul.children[1];
  const divNew = liNew.children[0];
  const spanNew = <HTMLSpanElement>divNew.children[0];
  t.is(spanNew.children[0].textContent, '');
  t.is(data.length, 2);
});
test('TreeMasterDetailRenderer dynamic remove added root', t => {
  const schema = {type: 'array', items: {
    type: 'object', id: 'foo', properties: {
      children: {type: 'array', items: {
        type: 'object', id: 'bar', properties: { name: {type: 'string'}}}},
        name: {type: 'string'}
    }
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = [{name: 'Foo', children: [{name: 'Bar'}]}];
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar', scope: {$ref: '#'},
  options: {}} as ControlElement);
  const result = renderer.render();
  const rootButton = <HTMLButtonElement>result.children[0].children[1];
  // content
  const content = <HTMLDivElement>result.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
  const ul = master.children[0];
  t.is(ul.children.length, 1);

  rootButton.click();
  t.is(ul.children.length, 2);
  const liNew = ul.children[1];
  const divNew = liNew.children[0];
  const spanNew = <HTMLSpanElement>divNew.children[0];
  t.is(data.length, 2);
  const removeButton = <HTMLButtonElement>spanNew.children[2];
  removeButton.click();
  t.is(data.length, 1);
});

test('TreeMasterDetailRenderer dynamic add child to existing', t => {
  const schema = {type: 'array', items: {
    type: 'object', id: 'foo', properties: {
      children: {type: 'array', items: {
        type: 'object', id: 'bar', properties: { name: {type: 'string'}}}},
        name: {type: 'string'}
    }
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = [{name: 'Foo', children: [{name: 'Bar'}]}];
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar', scope: {$ref: '#'},
  options: {}} as ControlElement);
  const result = renderer.render();
  const rootButton = <HTMLButtonElement>result.children[0].children[1];
  // content
  const content = <HTMLDivElement>result.children[1];
  const dialog = <HTMLDivElement>result.children[2];
  const dialogContent = dialog.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
  const ul = master.children[0];
  const li = ul.children[0];
  const div = li.children[0];
  const span = <HTMLSpanElement>div.children[0];
  const spanAdd = <HTMLSpanElement>span.children[1];
  const fooUL = li.children[1];
  t.is(fooUL.children.length, 1);
  t.is(dialogContent.children.length, 0);
  spanAdd.click();
  // dialog opened
  t.is(dialogContent.children.length, 1);
  const addButton = <HTMLButtonElement>dialogContent.children[0];
  t.is(addButton.innerText, 'children');
  addButton.click();
  // li children
  t.is(fooUL.children.length, 2);
  const liNew = fooUL.children[1];
  const divNew = liNew.children[0];
  const spanNew = <HTMLSpanElement>divNew.children[0];
  t.is(spanNew.children[0].textContent, '');
  t.is(data[0].children.length, 2);
});
test('TreeMasterDetailRenderer dynamic remove root', t => {
  const schema = {type: 'array', items: {
    type: 'object', id: 'foo', properties: {
      children: {type: 'array', items: {
        type: 'object', id: 'bar', properties: { name: {type: 'string'}}}},
        name: {type: 'string'}
    }
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = [{name: 'Foo'}];
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar', scope: {$ref: '#'},
  options: {}} as ControlElement);
  const result = renderer.render();
  const rootButton = <HTMLButtonElement>result.children[0].children[1];
  // content
  const content = <HTMLDivElement>result.children[1];
  const dialog = <HTMLDivElement>result.children[2];
  const dialogContent = dialog.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
  const ul = master.children[0];
  const li = ul.children[0];
  const div = li.children[0];
  const span = <HTMLSpanElement>div.children[0];
  const spanRemove = <HTMLSpanElement>span.children[2];
  spanRemove.click();
  // li children
  t.is(ul.children.length, 0);
  t.is(data.length, 0);
});
test('TreeMasterDetailRenderer dynamic remove child from existing', t => {
  const schema = {type: 'array', items: {
    type: 'object', id: 'foo', properties: {
      children: {type: 'array', items: {
        type: 'object', id: 'bar', properties: { name: {type: 'string'}}}},
        name: {type: 'string'}
    }
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = [{name: 'Foo', children: [{name: 'Bar'}]}];
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar', scope: {$ref: '#'},
  options: {}} as ControlElement);
  const result = renderer.render();
  const rootButton = <HTMLButtonElement>result.children[0].children[1];
  // content
  const content = <HTMLDivElement>result.children[1];
  const dialog = <HTMLDivElement>result.children[2];
  const dialogContent = dialog.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
  const ul = master.children[0];
  const li = ul.children[0];
  const div = li.children[0];
  const span = <HTMLSpanElement>div.children[0];
  const spanAdd = <HTMLSpanElement>span.children[1];
  const fooUL = li.children[1];
  t.is(fooUL.children.length, 1);
  t.is(dialogContent.children.length, 0);
  const liBar = fooUL.children[0];
  const divBar = liBar.children[0];
  const spanBar = <HTMLSpanElement>divBar.children[0];
  const removeButton = <HTMLButtonElement>spanBar.children[1];
  removeButton.click();
  // li children
  t.is(fooUL.children.length, 0);
  t.is(data[0].children.length, 0);
});
test('TreeMasterDetailRenderer dynamic add child to empty', t => {
  const schema = {type: 'array', items: {
    type: 'object', id: 'foo', properties: {
      children: {type: 'array', items: {
        type: 'object', id: 'bar', properties: { name: {type: 'string'}}}},
        name: {type: 'string'}
    }
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = [{name: 'Foo'}];
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar', scope: {$ref: '#'},
  options: {}} as ControlElement);
  const result = renderer.render();
  const rootButton = <HTMLButtonElement>result.children[0].children[1];
  // content
  const content = <HTMLDivElement>result.children[1];
  const dialog = <HTMLDivElement>result.children[2];
  const dialogContent = dialog.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
  const ul = master.children[0];
  const li = ul.children[0];
  const div = li.children[0];
  const span = <HTMLSpanElement>div.children[0];
  const spanAdd = <HTMLSpanElement>span.children[1];
  t.is(li.children.length, 1);
  t.is(dialogContent.children.length, 0);
  spanAdd.click();
  // dialog opened
  t.is(dialogContent.children.length, 1);
  const addButton = <HTMLButtonElement>dialogContent.children[0];
  t.is(addButton.innerText, 'children');
  addButton.click();
  // li children
  t.is(li.children.length, 2);
  const fooUL = li.children[1];
  t.is(fooUL.children.length, 1);
  const liNew = fooUL.children[0];
  const divNew = liNew.children[0];
  const spanNew = <HTMLSpanElement>divNew.children[0];
  t.is(spanNew.children[0].textContent, '');
  t.is(data[0]['children'].length, 1);

  // add second child
  spanAdd.click();
  // dialog opened
  t.is(dialogContent.children.length, 1);
  const addButton2 = <HTMLButtonElement>dialogContent.children[0];
  t.is(addButton2.innerText, 'children');
  addButton2.click();

  // li children
  t.is(li.children.length, 2);
  const fooUL2 = li.children[1];
  t.is(fooUL2.children.length, 2);
  const liNew2 = fooUL2.children[0];
  const divNew2 = liNew2.children[0];
  const spanNew2 = <HTMLSpanElement>divNew2.children[0];
  t.is(spanNew2.children[0].textContent, '');
  t.is(data[0]['children'].length, 2);
});
test('TreeMasterDetailRenderer dynamic cancel add', t => {
  const schema = {type: 'array', items: {
    type: 'object', id: 'foo', properties: {
      children: {type: 'array', items: {
        type: 'object', id: 'bar', properties: { name: {type: 'string'}}}},
        name: {type: 'string'}
    }
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = [{name: 'Foo'}];
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar', scope: {$ref: '#'},
  options: {}} as ControlElement);
  const result = renderer.render();
  const rootButton = <HTMLButtonElement>result.children[0].children[1];
  // content
  const content = <HTMLDivElement>result.children[1];
  const dialog = <HTMLDivElement>result.children[2];
  const dialogContent = dialog.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
  const ul = master.children[0];
  const li = ul.children[0];
  const div = li.children[0];
  const span = <HTMLSpanElement>div.children[0];
  const spanAdd = <HTMLSpanElement>span.children[1];
  t.is(li.children.length, 1);
  t.is(dialogContent.children.length, 0);
  spanAdd.click();
  // dialog opened
  t.is(dialogContent.children.length, 1);
  const addButton = <HTMLButtonElement>dialogContent.children[0];
  t.is(addButton.innerText, 'children');
  // cancel dialog
  const dialogCancel = <HTMLButtonElement>dialog.children[2];
  dialogCancel.click();

  // li children
  t.is(li.children.length, 1);
  t.is(data[0]['children'], undefined);
});
test('TreeMasterDetailRenderer dynamic remove added child', t => {
  const schema = {type: 'array', items: {
    type: 'object', id: 'foo', properties: {
      children: {type: 'array', items: {
        type: 'object', id: 'bar', properties: { name: {type: 'string'}}}},
        name: {type: 'string'}
    }
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = [{name: 'Foo'}];
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar', scope: {$ref: '#'},
  options: {}} as ControlElement);
  const result = renderer.render();
  const rootButton = <HTMLButtonElement>result.children[0].children[1];
  // content
  const content = <HTMLDivElement>result.children[1];
  const dialog = <HTMLDivElement>result.children[2];
  const dialogContent = dialog.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
  const ul = master.children[0];
  const li = ul.children[0];
  const div = li.children[0];
  const span = <HTMLSpanElement>div.children[0];
  const spanAdd = <HTMLSpanElement>span.children[1];
  t.is(li.children.length, 1);
  t.is(dialogContent.children.length, 0);
  spanAdd.click();
  // dialog opened
  t.is(dialogContent.children.length, 1);
  const addButton = <HTMLButtonElement>dialogContent.children[0];
  t.is(addButton.innerText, 'children');
  addButton.click();
  // li children
  t.is(li.children.length, 2);
  const fooUL = li.children[1];
  t.is(fooUL.children.length, 1);
  const liNew = fooUL.children[0];
  const divNew = liNew.children[0];
  const spanNew = <HTMLSpanElement>divNew.children[0];
  t.is(spanNew.children[0].textContent, '');
  t.is(data[0]['children'].length, 1);

  const removeButton = <HTMLButtonElement>spanNew.children[1];
  removeButton.click();
  t.is(data[0]['children'].length, 0);
});
test('TreeMasterDetailRenderer dataService notification wrong ref', t => {
  const schema = {type: 'object', properties: {
    children: {type: 'array', items: {
      type: 'object', properties: { name: {type: 'string'}}}},
    name: {type: 'string'}
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = {name: 'Foo', children: [{name: 'Bar'}]};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar',
    scope: {$ref: '#/properties/children'}, options: {}} as ControlElement);
  renderer.connectedCallback();
  const content = <HTMLDivElement>renderer.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
  const ul = master.children[0];
  t.is(ul.children.length, 1);
  dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/name'}}, 'Bar');
  const ulNew = master.children[0];
  t.is(ulNew, ul);
  t.is(renderer.children.length, 3);
  t.is(master.children.length, 1);
  t.is(ul.children.length, 1);
});
test('TreeMasterDetailRenderer dataService notification null ref', t => {
  const schema = {type: 'object', properties: {
    children: {type: 'array', items: {
      type: 'object', properties: { name: {type: 'string'}}}},
    name: {type: 'string'}
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = {name: 'Foo', children: [{name: 'Bar'}]};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar',
    scope: {$ref: '#/properties/children'}, options: {}} as ControlElement);
  renderer.connectedCallback();
  const content = <HTMLDivElement>renderer.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
  const ul = master.children[0];
  t.is(ul.children.length, 1);
  dataService.notifyAboutDataChange(null, undefined);
  const ulNew = master.children[0];
  t.is(ulNew, ul);
  t.is(renderer.children.length, 3);
  t.is(master.children.length, 1);
  t.is(ul.children.length, 1);
});
test('TreeMasterDetailRenderer dataService notification undefined ref', t => {
  const schema = {type: 'object', properties: {
    children: {type: 'array', items: {
      type: 'object', properties: { name: {type: 'string'}}}},
    name: {type: 'string'}
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = {name: 'Foo', children: [{name: 'Bar'}]};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar',
    scope: {$ref: '#/properties/children'}, options: {}} as ControlElement);
  renderer.connectedCallback();
  const content = <HTMLDivElement>renderer.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
  const ul = master.children[0];
  t.is(ul.children.length, 1);
  dataService.notifyAboutDataChange(undefined, undefined);
  const ulNew = master.children[0];
  t.is(ulNew, ul);
  t.is(renderer.children.length, 3);
  t.is(master.children.length, 1);
  t.is(ul.children.length, 1);
});
test('TreeMasterDetailRenderer dataService no notification after disconnect', t => {
  const schema = {type: 'object', properties: {
    children: {type: 'array', items: {
      type: 'object', properties: { name: {type: 'string'}}}},
    name: {type: 'string'}
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = {name: 'Foo', children: [{name: 'Bar'}]};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar',
    scope: {$ref: '#/properties/children'}, options: {}} as ControlElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const content = <HTMLDivElement>renderer.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
  const ul = master.children[0];
  t.is(ul.children.length, 1);
  dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/children'}}, 'Bar');
  const ulNew = master.children[0];
  t.is(ulNew, ul);
  t.is(renderer.children.length, 3);
  t.is(master.children.length, 1);
  t.is(ul.children.length, 1);
});
test('TreeMasterDetailRenderer dataService notification', t => {
  const schema = {type: 'object', properties: {
    children: {type: 'array', items: {
      type: 'object', properties: { name: {type: 'string'}}}},
    name: {type: 'string'}
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = {name: 'Foo', children: [{name: 'Bar'}]};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar',
    scope: {$ref: '#/properties/children'}, options: {}} as ControlElement);
  renderer.connectedCallback();
  const content = <HTMLDivElement>renderer.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
  const ul = master.children[0];
  t.is(ul.children.length, 1);
  dataService.notifyAboutDataChange({type: 'MasterDetailLayout', scope: {$ref: '#/properties/children'}},
    [{name: 'Bar'}, {name: 'Doe'}]);
  const ulNew = master.children[0];
  const equal = ul === ulNew;
  t.false(equal);
  t.is(renderer.children.length, 3);
  t.is(master.children.length, 1);
  t.is(ulNew.children.length, 2);
  t.is(ulNew.children[0].children[0].children[0].children[0].textContent, 'Bar');
  t.is(ulNew.children[1].children[0].children[0].children[0].textContent, 'Doe');
});
test('TreeMasterDetailRenderer dataService notification value undefined', t => {
  const schema = {type: 'object', properties: {
    children: {type: 'array', items: {
      type: 'object', properties: { name: {type: 'string'}}}},
    name: {type: 'string'}
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = {name: 'Foo', children: [{name: 'Bar'}]};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar',
    scope: {$ref: '#/properties/children'}, options: {}} as ControlElement);
  renderer.connectedCallback();
  const content = <HTMLDivElement>renderer.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
  const ul = master.children[0];
  t.is(ul.children.length, 1);
  dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/children'}}, undefined);
  const ulNew = master.children[0];
  const equal = ul === ulNew;
  t.false(equal);
  t.is(ulNew.children.length, 0);
});
test('TreeMasterDetailRenderer dataService notification value null', t => {
  const schema = {type: 'object', properties: {
    children: {type: 'array', items: {
      type: 'object', properties: { name: {type: 'string'}}}},
    name: {type: 'string'}
  }} as JsonSchema;
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const data = {name: 'Foo', children: [{name: 'Bar'}]};
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'MasterDetailLayout', label: 'FooBar',
    scope: {$ref: '#/properties/children'}, options: {}} as ControlElement);
  renderer.connectedCallback();
  const content = <HTMLDivElement>renderer.children[1];
  // content -> master tree
  const master = <HTMLDivElement>content.children[0]; // <-- TODO needed?
  const ul = master.children[0];
  t.is(ul.children.length, 1);
  dataService.notifyAboutDataChange({type: 'Control', scope: {$ref: '#/properties/children'}}, null);
  const ulNew = master.children[0];
  const equal = ul === ulNew;
  t.false(equal);
  t.is(ulNew.children.length, 0);
});
test('TreeMasterDetailRenderer notify visible', t => {
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const treeMasterDetail = {type: 'MasterDetailLayout', scope: {$ref: '#'}} as ControlElement;
  renderer.setDataService(new DataService({}));
  renderer.setDataSchema({type: 'object', properties: {}});
  renderer.setUiSchema(treeMasterDetail);
  renderer.connectedCallback();
  const runtime = <Runtime>treeMasterDetail['runtime'];
  runtime.visible = false;
  t.is(renderer.hidden, true);
});
test('TreeMasterDetailRenderer notify disabled', t => {
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const treeMasterDetail = {type: 'MasterDetailLayout', scope: {$ref: '#'}} as ControlElement;
  renderer.setDataService(new DataService({}));
  renderer.setDataSchema({type: 'object', properties: {}});
  renderer.setUiSchema(treeMasterDetail);
  renderer.connectedCallback();
  const runtime = <Runtime>treeMasterDetail['runtime'];
  runtime.enabled = false;
  t.is(renderer.getAttribute('disabled'), 'true');
});
test('TreeMasterDetailRenderer notify enabled', t => {
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const treeMasterDetail = {type: 'MasterDetailLayout', scope: {$ref: '#'}} as ControlElement;
  renderer.setDataService(new DataService({}));
  renderer.setDataSchema({type: 'object', properties: {}});
  renderer.setUiSchema(treeMasterDetail);
  renderer.connectedCallback();
  const runtime = <Runtime>treeMasterDetail['runtime'];
  runtime.enabled = true;
  t.false(renderer.hasAttribute('disabled'));
});
test('TreeMasterDetailRenderer disconnected no notify visible', t => {
  const renderer: TreeMasterDetailRenderer = new TreeMasterDetailRenderer();
  const treeMasterDetail = {type: 'MasterDetailLayout', scope: {$ref: '#'}} as ControlElement;
  renderer.setDataService(new DataService({}));
  renderer.setDataSchema({type: 'object', properties: {}});
  renderer.setUiSchema(treeMasterDetail);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>treeMasterDetail['runtime'];
  runtime.visible = false;
  t.is(renderer.hidden, false);
});
