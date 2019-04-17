/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import '@jsonforms/test';
import * as React from 'react';
import * as _ from 'lodash';
import test from 'ava';
import { Provider } from 'react-redux';
import {
  ControlElement,
  getData,
  HorizontalLayout,
  update
} from '@jsonforms/core';
import TableArrayControl, { tableArrayControlTester, } from '../../src/complex/TableArrayControl';
import HorizontalLayoutRenderer from '../../src/layouts/HorizontalLayout';
import '../../src';
import * as TestUtils from 'react-dom/test-utils';
import { initJsonFormsVanillaStore } from '../vanillaStore';
import IntegerCell, { integerCellTester } from '../../src/cells/IntegerCell';

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
      name: 'array.table',
      classNames: ['array-table-layout', 'control']
    }
  ];
});

test('render two children', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    cells: [
      { tester: integerCellTester, cell: IntegerCell }
    ]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  ) as unknown as React.Component<any>;

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
  // two data columns + validation column
  t.is(headRow.children.length, 3);

  const headColumn1 = headRow.children.item(0);
  t.is(headColumn1.tagName, 'TH');
  t.is((headColumn1 as HTMLTableHeaderCellElement).textContent, 'X');

  const headColumn2 = headRow.children.item(1);
  t.is(headColumn2.tagName, 'TH');
  t.is((headColumn2 as HTMLTableHeaderCellElement).textContent, 'Y');

  const tBody = tableChildren.item(1);
  t.is(tBody.tagName, 'TBODY');
  t.is(tBody.children.length, 1);
  const bodyRow = tBody.children.item(0);
  t.is(bodyRow.tagName, 'TR');
  // two data columns + validation column
  t.is(bodyRow.children.length, 3);

  const tds = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'td');
  t.is(tds.length, 3);
  t.is(tds[0].children.length, 1);
  t.is(tds[0].children[0].id, '');
  t.is(tds[1].children.length, 1);
  t.is(tds[1].children[0].id, '');
});

test('render empty data', t => {
  t.context.uischema = {
    label: false,
    type: 'Control',
    scope: '#/properties/test'
  };
  const store = initJsonFormsVanillaStore({
    data: {},
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  ) as unknown as React.Component<any>;

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
  // two data columns + validation column
  t.is(headRow.children.length, 3);

  const headColumn1 = headRow.children.item(0);
  t.is(headColumn1.tagName, 'TH');
  t.is((headColumn1 as HTMLTableHeaderCellElement).textContent, 'X');

  const headColumn2 = headRow.children.item(1);
  t.is(headColumn2.tagName, 'TH');
  t.is((headColumn2 as HTMLTableHeaderCellElement).textContent, 'Y');

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
  const store = initJsonFormsVanillaStore({
    data: { test: [] },
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  ) as unknown as React.Component<any>;

  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'root_properties_test');
  t.not(control, undefined);

  const button = TestUtils.findRenderedDOMComponentWithTag(tree, 'button') as HTMLButtonElement;
  TestUtils.Simulate.click(button);
  t.is(getData(store.getState()).test.length, 1);
});

test('render new child (undefined data)', t => {
  const store = initJsonFormsVanillaStore({
    data: { test: undefined },
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  ) as unknown as React.Component<any>;

  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'root_properties_test');
  t.not(control, undefined);

  const button = TestUtils.findRenderedDOMComponentWithTag(tree, 'button') as HTMLButtonElement;
  TestUtils.Simulate.click(button);
  t.is(getData(store.getState()).test.length, 1);
});

test('render new child (null data)', t => {
  const store = initJsonFormsVanillaStore({
    data: { test: null },
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  ) as unknown as React.Component<any>;

  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'root_properties_test');
  t.not(control, undefined);

  const button = TestUtils.findRenderedDOMComponentWithTag(tree, 'button') as HTMLButtonElement;
  TestUtils.Simulate.click(button);
  t.is(getData(store.getState()).test.length, 1);
});

test('render new child', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  ) as unknown as React.Component<any>;

  const button = TestUtils.findRenderedDOMComponentWithTag(tree, 'button') as HTMLButtonElement;
  TestUtils.Simulate.click(button);
  t.is(getData(store.getState()).test.length, 2);
});

test('render primitives ', t => {
  const schema = {
    type: 'object',
    properties: {
      test: {
        type: 'array',
        items: {
          type: 'string',
          maxLength: 3
        }
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/test'
  };
  const store = initJsonFormsVanillaStore({
    data: { test: ['foo', 'bars'] },
    schema,
    uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl
        schema={schema}
        uischema={uischema}
      />
    </Provider>
  ) as unknown as React.Component<any>;
  const rows = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'tr');
  const lastRow = _.last(rows) as HTMLTableRowElement;
  t.is(lastRow.children.item(1).textContent, 'should NOT be longer than 3 characters');
  t.is(rows.length, 3);
});

test('update via action', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  ) as unknown as React.Component<any>;

  const children = TestUtils.findRenderedDOMComponentWithTag(tree, 'tbody');
  t.is(children.childNodes.length, 1);

  store.dispatch(update('test', () => [{x: 1, y: 3}, {x: 2, y: 3}]));
  t.is(children.childNodes.length, 2);

  store.dispatch(update(undefined, () => [{x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}]));
  t.is(children.childNodes.length, 2);
});

test('tester', t =>  t.is(tableArrayControlTester({type: 'Foo'}, null), -1));

test('tester with recursive document ref only', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#'
  };
  t.is(tableArrayControlTester(control, undefined), -1);
});

test(' tester with prop of wrong type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/x'
  };
  t.is(
    tableArrayControlTester(
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
    tableArrayControlTester(
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
    tableArrayControlTester(
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
    tableArrayControlTester(
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
    3
  );
});

test('tester', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/test'
  };

  t.is(tableArrayControlTester(uischema, t.context.schema), 3);
});

test('hide', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    styles: t.context.styles
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl
        schema={t.context.schema}
        uischema={t.context.uischema}
        visible={false}

      />
    </Provider>
  ) as unknown as React.Component<any>;
  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'control') as HTMLElement;
  t.true(control.hidden);
});

test('show by default', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    styles: t.context.styles
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  ) as unknown as React.Component<any>;
  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'control') as HTMLElement;
  t.false(control.hidden);
});

test('single error', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  ) as unknown as React.Component<any>;
  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  store.dispatch(update('test', () => 2));
  t.is(validation.textContent, 'should be array');
});

test('multiple errors', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  ) as unknown as React.Component<any>;
  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  store.dispatch(update('test', () => 3));
  t.is(validation.textContent, 'should be array');
});

test('empty errors by default', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  ) as unknown as React.Component<any>;
  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  t.is(validation.textContent, '');
});

test('reset validation message', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  ) as unknown as React.Component<any>;
  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  store.dispatch(update('test', () => 3));
  t.is(validation.textContent, 'should be array');
  store.dispatch(update('test', () => []));
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
  const store = initJsonFormsVanillaStore({
    data: {
      name: 'John Doe',
      personalData: {}
    },
    schema,
    uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer schema={schema} uischema={uischema}/>
    </Provider>
  ) as unknown as React.Component<any>;
  const validation = TestUtils.scryRenderedDOMComponentsWithClass(tree, 'validation');
  t.is(validation[0].textContent, '');
  t.is(validation[1].textContent, 'is a required property');
  t.is(validation[2].textContent, 'is a required property');
});
