import { initJsonFormsStore } from '@jsonforms/test';
import * as React from 'react';
import test from 'ava';
import { Provider } from 'react-redux';
import {
  ControlElement,
  getData,
  HorizontalLayout,
  update,
  validate
} from '@jsonforms/core';
import TableArrayControl, { tableArrayTester, } from '../../src/complex/TableArrayControl';
import HorizontalLayoutRenderer from '../../src/layouts/HorizontalLayout';
import '../../src';
import * as TestUtils from 'react-dom/test-utils';

test.beforeEach(t => {

  t.context.schema = {
    type: 'object',
    properties: {
      test: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            x: { type: 'integer' },
            y: { type: 'integer' }
          }
        }
      }
    }
  };
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/test'
  };
  t.context.data = {
    test: [{ x: 1, y: 3 }]
  };
  t.context.styles = [
    {
      name: 'array-table',
      classNames: ['array-table-layout', 'control']
    }
  ];
});

test('render two children', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const header = TestUtils.findRenderedDOMComponentWithTag(tree, 'header') as HTMLInputElement;
  const legendChildren = header.children;

  const label = legendChildren.item(0);
  t.is(label.tagName, 'LABEL');
  t.is(label.innerHTML, 'Test');

  const button = legendChildren.item(1);
  t.is(button.tagName, 'BUTTON');
  t.is(button.innerHTML, 'Add to Test');

  const table = TestUtils.findRenderedDOMComponentWithTag(tree, 'table') as HTMLInputElement;
  const tableChildren = table.children;
  t.is(tableChildren.length, 2);
  const tHead = tableChildren.item(0);
  t.is(tHead.tagName, 'THEAD');
  t.is(tHead.children.length, 1);
  const headRow = tHead.children.item(0);
  t.is(headRow.tagName, 'TR');
  t.is(headRow.children.length, 2);

  const headColumn1 = headRow.children.item(0);
  t.is(headColumn1.tagName, 'TH');
  t.is((headColumn1 as HTMLTableHeaderCellElement).textContent, 'x');

  const headColumn2 = headRow.children.item(1);
  t.is(headColumn2.tagName, 'TH');
  t.is((headColumn2 as HTMLTableHeaderCellElement).textContent, 'y');

  const tBody = tableChildren.item(1);
  t.is(tBody.tagName, 'TBODY');
  t.is(tBody.children.length, 1);
  const bodyRow = tBody.children.item(0);
  t.is(bodyRow.tagName, 'TR');
  t.is(bodyRow.children.length, 2);

  const tds = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'td');
  t.is(tds.length, 2);
  t.is(tds[0].children.length, 1);
  t.is(tds[0].children[0].id, '#/properties/x');
  t.is(tds[1].children.length, 1);
  t.is(tds[1].children[0].id, '#/properties/y');
});

test('render empty data', t => {
  t.context.uischema = {
    label: false,
    type: 'Control',
    scope: '#/properties/test'
  };
  const store = initJsonFormsStore({
    data: {},
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const header = TestUtils.findRenderedDOMComponentWithTag(tree, 'header') as HTMLInputElement;
  const legendChildren = header.children;
  const label = legendChildren.item(0) as HTMLLabelElement;
  t.is(label.tagName, 'LABEL');
  t.is(label.textContent, '');

  const button = legendChildren.item(1);
  t.is(button.tagName, 'BUTTON');
  t.is(button.textContent, 'Add to Test');

  const table = TestUtils.findRenderedDOMComponentWithTag(tree, 'table') as HTMLTableElement;
  const tableChildren = table.children;
  t.is(tableChildren.length, 2);

  const tHead = tableChildren.item(0);
  t.is(tHead.tagName, 'THEAD');
  t.is(tHead.children.length, 1);

  const headRow = tHead.children.item(0);
  t.is(headRow.tagName, 'TR');
  t.is(headRow.children.length, 2);

  const headColumn1 = headRow.children.item(0);
  t.is(headColumn1.tagName, 'TH');
  t.is((headColumn1 as HTMLTableHeaderCellElement).textContent, 'x');

  const headColumn2 = headRow.children.item(1);
  t.is(headColumn2.tagName, 'TH');
  t.is((headColumn2 as HTMLTableHeaderCellElement).textContent, 'y');

  const tBody = tableChildren.item(1);
  t.is(tBody.tagName, 'TBODY');
  t.is(tBody.children.length, 1);
  const noDataRow = tBody.children[0];
  t.is(noDataRow.tagName, 'TR');
  t.is(noDataRow.children.length, 1);
  const noDataColumn = noDataRow.children[0];
  t.is(noDataColumn.tagName, 'TD');
  t.is(noDataColumn.textContent, 'No data');
});

test('render new child (empty init data)', t => {
  const store = initJsonFormsStore({
    data: { test: [] },
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'root_properties_test');
  t.not(control, undefined);

  const button = TestUtils.findRenderedDOMComponentWithTag(tree, 'button') as HTMLButtonElement;
  TestUtils.Simulate.click(button);
  t.is(getData(store.getState()).test.length, 1);
});

test('render new child', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const button = TestUtils.findRenderedDOMComponentWithTag(tree, 'button') as HTMLButtonElement;
  TestUtils.Simulate.click(button);
  t.is(getData(store.getState()).test.length, 2);
});

test('update via action', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const children = TestUtils.findRenderedDOMComponentWithTag(tree, 'tbody');
  t.is(children.childNodes.length, 1);

  store.dispatch(update('test', () => [{x: 1, y: 3}, {x: 2, y: 3}]));
  t.is(children.childNodes.length, 2);

  store.dispatch(update(undefined, () => [{x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}]));
  t.is(children.childNodes.length, 2);
});

test('tester', t =>  t.is(tableArrayTester({type: 'Foo'}, null), -1));

test('tester with recursive document ref only', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#'
  };
  t.is(tableArrayTester(control, undefined), -1);
});

test(' tester with prop of wrong type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/x'
  };
  t.is(
    tableArrayTester(
      control,
      {
        type: 'object',
        properties: {
          x: { type: 'integer' }
        }
      }
    ),
    -1
  );
});

test('tester with correct prop type, but without items', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.is(
    tableArrayTester(
      control,
      {
        type: 'object',
        properties: {
          foo: { type: 'array' }
        }
      }
    ),
    -1
  );
});

test('tester with correct prop type, but different item types', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.is(
    tableArrayTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'array',
            items: [
              { type: 'integer' },
              { type: 'string' },
            ]
          }
        }
      }
    ),
    -1
  );
});

test('tester with primitive item type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.is(
    tableArrayTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'array',
            items: { type: 'integer' }
          }
        }
      }
    ),
    -1
  );
});

test('tester', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/test'
  };

  t.is(tableArrayTester(uischema, t.context.schema), 3);
});

test('hide', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl
        schema={t.context.schema}
        uischema={t.context.uischema}
        visible={false}
      />
    </Provider>
  );
  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'control') as HTMLElement;
  t.true(control.hidden);
});

test('show by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'control') as HTMLElement;
  t.false(control.hidden);
});

test('single error', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  store.dispatch(update('test', () => 2));
  store.dispatch(validate());
  t.is(validation.textContent, 'should be array');
});

test('multiple errors', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  store.dispatch(update('test', () => 3));
  store.dispatch(validate());
  t.is(validation.textContent, 'should be array');
});

test('empty errors by default', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  t.is(validation.textContent, '');
});

test('reset validation message', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  store.dispatch(update('test', () => 3));
  store.dispatch(validate());
  t.is(validation.textContent, 'should be array');
  store.dispatch(update('test', () => []));
  store.dispatch(validate());
  t.is(validation.textContent, '');
});
// must be thought through as to where to show validation errors
test.skip('validation of nested schema', t => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      personalData: {
        type: 'object',
        properties: {
          middleName: { type: 'string' },
          lastName:   { type: 'string' }
        },
        required: ['middleName', 'lastName']
      }
    },
    required: ['name']
  };
  const firstControl: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const secondControl: ControlElement = {
    type: 'Control',
    scope: '#/properties/personalData/properties/middleName'
  };
  const thirdControl: ControlElement = {
    type: 'Control',
    scope: '#/properties/personalData/properties/lastName'
  };
  const uischema: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: [firstControl, secondControl, thirdControl]
  };
  const store = initJsonFormsStore({
    data: {
      name: 'John Doe',
      personalData: {}
    },
    schema,
    uischema
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer schema={schema} uischema={uischema}/>
    </Provider>
  );
  const validation = TestUtils.scryRenderedDOMComponentsWithClass(tree, 'validation');
  store.dispatch(validate());
  t.is(validation[0].textContent, '');
  t.is(validation[1].textContent, 'is a required property');
  t.is(validation[2].textContent, 'is a required property');
});
