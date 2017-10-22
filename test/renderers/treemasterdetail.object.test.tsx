import { JSX } from '../../src/renderers/JSX';
import { initJsonFormsStore } from '../helpers/setup';
import test from 'ava';
import { MasterDetailLayout } from '../../src/models/uischema';
import TreeMasterDetail from '../../src/renderers/additional/tree-renderer';
import { JsonForms } from '../../src/core';
import {
  findRenderedDOMElementWithClass,
  findRenderedDOMElementWithTag,
  renderIntoDocument
} from 'inferno-test-utils';
import { Provider } from 'inferno-redux';

test.beforeEach(t => {
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
      name: {type: 'string'}
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

test('render object', t => {
  JsonForms.schema = t.context.schema;
  const data = {name: 'Foo', children: [{name: 'Bar'}]};
  const store = initJsonFormsStore(data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail schema={t.context.schema}
                        uischema={t.context.uischema}
      />
    </Provider>
  );

  const result = findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
  const header = result.firstElementChild as HTMLDivElement;
  const label = header.firstElementChild as HTMLLabelElement;
  const master = findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail-master');
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
  const detail = findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail-detail');
  const dialog = findRenderedDOMElementWithTag(tree, 'dialog');
  const dialogLabel = dialog.children[0] as HTMLLabelElement;
  const dialogContent = dialog.children[1] as HTMLDivElement;
  const dialogClose = dialog.children[2] as HTMLButtonElement;

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

test('render object with array', t => {
  JsonForms.schema = t.context.schema;
  const data = { name: 'Foo', children: [{name: 'Bar'}] };
  const uischema: MasterDetailLayout = {
    type: 'MasterDetailLayout',
    label: 'FooBar',
    scope: {
      $ref: '#/properties/children'
    },
    options: {}
  };

  const store = initJsonFormsStore(data, t.context.schema, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TreeMasterDetail schema={t.context.schema}
                        uischema={uischema}
      />
    </Provider>
  );
  const result = findRenderedDOMElementWithClass(tree, 'jsf-treeMasterDetail');
  const header = result.children[0] as HTMLDivElement;
  const label = header.children[0] as HTMLLabelElement;
  const rootButton = header.children[1] as HTMLButtonElement;
  const content = result.children[1] as HTMLDivElement;
  const master = content.children[0] as HTMLDivElement;
  const ul = master.children[0];
  const li = ul.children[0];
  const div = li.children[0];
  const span = div.children[0];
  const spanLabel = span.children[0];
  const spanDelete = span.children[1];
  const detail = content.children[1] as HTMLDivElement;
  const dialog = findRenderedDOMElementWithTag(tree, 'dialog');
  const dialogLabel = dialog.children[0] as HTMLLabelElement;
  const dialogContent = dialog.children[1] as HTMLDivElement;
  const dialogClose = dialog.children[2] as HTMLButtonElement;

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
