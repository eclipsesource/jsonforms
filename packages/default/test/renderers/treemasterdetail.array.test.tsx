import * as React from 'react';
import * as _ from 'lodash';
import { initJsonFormsStore } from '../helpers/setup';
import test from 'ava';
import { getData, MasterDetailLayout } from 'jsonforms-core';
import { JsonForms } from 'jsonforms-core';
import {
  click,
  findRenderedDOMElementWithClass,
  renderIntoDocument
} from '../helpers/binding';
import { Provider } from 'react-redux';
import TreeMasterDetail from '../../src/additional/tree-renderer';
import {
  findRenderedDOMElementWithTag,
  scryRenderedDOMElementsWithClass, scryRenderedDOMElementsWithTag
} from '../helpers/react-test';

test.beforeEach(t => {
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
              name: {type: 'string'}
            }
          }
        },
        name: {type: 'string'}
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

const openDialog = (tree): void => {
  const openDialogSpan = findRenderedDOMElementWithClass(tree, 'add') as HTMLSpanElement;
  click(openDialogSpan);
};

const closeDialog = (tree): void => {
  const dialog = findRenderedDOMElementWithTag(tree, 'dialog');
  const dialogCloseButton = dialog.lastElementChild as HTMLButtonElement;
  click(dialogCloseButton);
};

const clickFirstDialogButton = (tree): void => {
  const dialog = findRenderedDOMElementWithTag(tree, 'dialog');
  const dialogContents = dialog.getElementsByClassName('dialog-content');
  const dialogContent = _.head(dialogContents);
  const button = dialogContent.firstElementChild as HTMLButtonElement;
  click(button);
};

test('render', t => {
  JsonForms.schema = t.context.schema;
  const uischema: MasterDetailLayout = {
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
  const data = [{name: 'Foo', children: [{name: 'Bar'}]}];
  const store = initJsonFormsStore(data, t.context.schema, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail data={data}
                        schema={t.context.schema}
                        uischema={uischema}
      />
    </Provider>
  );

  const result = findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
  const header = result.children[0] as HTMLDivElement;
  const content = result.children[1] as HTMLDivElement;

  const label = header.children[0] as HTMLLabelElement;
  const rootButton = header.children[1] as HTMLButtonElement;

  const master = content.children[0] as HTMLDivElement;
  const detail = content.children[1] as HTMLDivElement;

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
});

test('select', t => {
  const data = [{name: 'Foo', children: [{name: 'Bar'}]}];
  const store = initJsonFormsStore(data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail schema={t.context.schema}
                        uischema={t.context.uischema}
      />
    </Provider>
  );

  const spanBar = _.last(scryRenderedDOMElementsWithClass(tree, 'label')) as HTMLSpanElement;
  const detail = findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail-detail');

  spanBar.click();
  t.is(detail.children.length, 1);
  // TODO: additional asserts
});

test('add to root', t => {
  const data = [{name: 'Foo', children: [{name: 'Bar'}]}];
  const store = initJsonFormsStore(data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail schema={t.context.schema}
                        uischema={t.context.uischema}
      />
    </Provider>
  );

  const rootButton = _.head(scryRenderedDOMElementsWithTag(tree, 'button')) as HTMLButtonElement;
  const ul = _.head(scryRenderedDOMElementsWithTag(tree, 'ul'));
  click(rootButton);
  const liNew = ul.children[1];
  const divNew = liNew.firstElementChild;
  const spanNew = divNew.firstElementChild as HTMLSpanElement;

  t.is(ul.children.length, 2);
  t.is(spanNew.children[0].textContent, '');
  t.is(getData(store.getState()).length, 2);
});

test('add to root and remove', t => {
  JsonForms.schema = t.context.schema;
  const data = [{name: 'Foo', children: [{name: 'Bar'}]}];
  const store = initJsonFormsStore(data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail schema={t.context.schema}
                        uischema={t.context.uischema}
      />
    </Provider>
  );
  const rootButton = _.head(scryRenderedDOMElementsWithTag(tree, 'button')) as HTMLButtonElement;
  const ul = _.head(scryRenderedDOMElementsWithTag(tree, 'ul'));
  rootButton.click();
  const removeSpan = _.last(scryRenderedDOMElementsWithClass(tree, 'remove')) as HTMLSpanElement;
  removeSpan.click();

  t.is(ul.children.length, 1);
  t.is(getData(store.getState()).length, 1);
});

test('add to nested data', t => {
  JsonForms.schema = t.context.schema;
  const data = [{name: 'Foo', children: [{name: 'Bar'}]}];
  const store = initJsonFormsStore(data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail schema={t.context.schema}
                        uischema={t.context.uischema}
      />
    </Provider>
  );

  openDialog(tree);
  clickFirstDialogButton(tree);
  const fooUl = _.last(scryRenderedDOMElementsWithTag(tree, 'ul'));
  const liNew = fooUl.children[1];
  const divNew = liNew.firstElementChild;
  const spanNew = divNew.firstElementChild as HTMLSpanElement;

  t.is(fooUl.children.length, 2);
  t.is(spanNew.children[0].textContent, '');
  t.is(getData(store.getState())[0].children.length, 2);
});

test('remove from root', t => {
  JsonForms.schema = t.context.schema;
  const data = [{name: 'Foo'}];
  const store = initJsonFormsStore(data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail schema={t.context.schema}
                        uischema={t.context.uischema}
      />
    </Provider>
  );

  const ul = findRenderedDOMElementWithTag(tree, 'ul') as HTMLUListElement;
  const spanRemove = findRenderedDOMElementWithClass(tree, 'remove') as HTMLSpanElement;
  click(spanRemove);

  t.is(ul.children.length, 0);
  t.is(getData(store.getState()).length, 0);
});

test('remove from nested data', t => {
  const data = [{name: 'Foo', children: [{name: 'Bar'}]}];
  const store = initJsonFormsStore(data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail schema={t.context.schema}
                        uischema={t.context.uischema}
      />
    </Provider>
  );

  const spanRemove = _.last(scryRenderedDOMElementsWithClass(tree, 'remove')) as HTMLSpanElement;
  click(spanRemove);
  const ul = _.head(scryRenderedDOMElementsWithTag(tree, 'li'));
  const li = ul.firstElementChild;

  t.is(li.children.length, 1);
  t.is(getData(store.getState())[0].children.length, 0);
});

test('add two nested children', t => {
  const data = [{ name: 'Foo' }];
  const store = initJsonFormsStore(data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail schema={t.context.schema}
                        uischema={t.context.uischema}
      />
    </Provider>
  );

  // add first child
  openDialog(tree);
  clickFirstDialogButton(tree);

  // add second child
  openDialog(tree);
  clickFirstDialogButton(tree);

  const fooUl = _.last(scryRenderedDOMElementsWithTag(tree, 'ul'));
  const spanNew = _.head(fooUl.getElementsByTagName('span'));

  t.is(fooUl.children.length, 2);
  t.is(spanNew.children[0].textContent, '');
  t.is(getData(store.getState())[0].children.length, 2);
});

test('cancel dialog', t => {
  const data = [{name: 'Foo'}];
  const store = initJsonFormsStore(data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail schema={t.context.schema}
                        uischema={t.context.uischema}
      />
    </Provider>
  );

  openDialog(tree);
  closeDialog(tree);
  const li = findRenderedDOMElementWithTag(tree, 'li');

  // same length as before
  t.is(li.children.length, 1);
  t.false(_.has(_.head<any>(store.getState().data), 'children'));
});

test('add and remove child', t => {
  const data = [{name: 'Foo'}];
  const store = initJsonFormsStore(data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail schema={t.context.schema}
                        uischema={t.context.uischema}
      />
    </Provider>
  );

  openDialog(tree);
  clickFirstDialogButton(tree);
  const removeButton = _.last(scryRenderedDOMElementsWithClass(tree, 'remove')) as HTMLSpanElement;
  click(removeButton);

  t.is(getData(store.getState())[0].children.length, 0);
});
