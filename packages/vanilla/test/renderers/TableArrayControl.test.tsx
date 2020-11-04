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
import * as React from 'react';
import * as _ from 'lodash';
import { Provider } from 'react-redux';
import {
  ControlElement,
  getData,
  HorizontalLayout,
  update
} from '@jsonforms/core';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import { JsonFormsReduxContext } from '@jsonforms/react/lib/redux';
import TableArrayControl, { tableArrayControlTester, } from '../../src/complex/TableArrayControl';
import HorizontalLayoutRenderer from '../../src/layouts/HorizontalLayout';
import '../../src';
import { initJsonFormsVanillaStore } from '../vanillaStore';
import IntegerCell, { integerCellTester } from '../../src/cells/IntegerCell';

Enzyme.configure({ adapter: new Adapter() });

const fixture = {
  schema: {
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
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/test'
  },
  data: {
    test: [{ x: 1, y: 3 }]
  },
  styles: [
    {
      name: 'array.table',
      classNames: ['array-table-layout', 'control']
    }
  ]
};

const fixture2 = {
  schema: {
    type: 'object',
    properties: {
      test: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            x: {
              type: 'integer',
              title: 'Column X',
            },
            y: { type: 'integer' }
          }
        }
      }
    }
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/test'
  },
  data: {
    test: [{ x: 1, y: 3 }]
  },
  styles: [
    {
      name: 'array.table',
      classNames: ['array-table-layout', 'control']
    }
  ]
};

describe('Tabe array tester', () => {
  test('tester with recursive document ref only', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#'
    };
    expect(tableArrayControlTester(control, undefined)).toBe(-1);
  });

  test(' tester with prop of wrong type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/x'
    };
    expect(
      tableArrayControlTester(
        control,
        {
          type: 'object',
          properties: {
            x: { type: 'integer' }
          }
        }
      )
    ).toBe(-1);
  });

  test('tester with correct prop type, but without items', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      tableArrayControlTester(
        control,
        {
          type: 'object',
          properties: {
            foo: { type: 'array' }
          }
        }
      )
    ).toBe(-1);
  });

  test('tester with correct prop type, but different item types', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
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
      )
    ).toBe(-1);
  });

  test('tester with primitive item type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
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
      )
    ).toBe(3);
  });

  test('tester', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/test'
    };

    expect(tableArrayControlTester(uischema, fixture.schema)).toBe(3);
  });

  test('tester - wrong type', () => expect(tableArrayControlTester({ type: 'Foo' }, null)).toBe(-1));
});

describe('Tabe array control', () => {

  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test('render two children', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema,
      cells: [
        { tester: integerCellTester, cell: IntegerCell }
      ]
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TableArrayControl
            schema={fixture.schema}
            uischema={fixture.uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    const header = wrapper.find('header').getDOMNode();
    const legendChildren = header.children;

    const label = legendChildren.item(0);
    expect(label.tagName).toBe('LABEL');
    expect(label.innerHTML).toBe('Test');

    const button = legendChildren.item(1);
    expect(button.tagName).toBe('BUTTON');
    expect(button.innerHTML).toBe('Add to Test');

    const table = wrapper.find('table').getDOMNode() as HTMLInputElement;
    const tableChildren = table.children;
    expect(tableChildren).toHaveLength(2);
    const tHead = tableChildren.item(0);
    expect(tHead.tagName).toBe('THEAD');
    expect(tHead.children).toHaveLength(1);
    const headRow = tHead.children.item(0);
    expect(headRow.tagName).toBe('TR');
    // two data columns + validation column + delete column
    expect(headRow.children).toHaveLength(4);

    const headColumn1 = headRow.children.item(0);
    expect(headColumn1.tagName).toBe('TH');
    expect((headColumn1 as HTMLTableHeaderCellElement).textContent).toBe('X');

    const headColumn2 = headRow.children.item(1);
    expect(headColumn2.tagName).toBe('TH');
    expect((headColumn2 as HTMLTableHeaderCellElement).textContent).toBe('Y');

    const tBody = tableChildren.item(1);
    expect(tBody.tagName).toBe('TBODY');
    expect(tBody.children).toHaveLength(1);
    const bodyRow = tBody.children.item(0);
    expect(bodyRow.tagName).toBe('TR');
    // two data columns + validation column + delete column
    expect(bodyRow.children).toHaveLength(4);

    const tds = wrapper.find('td');
    expect(tds).toHaveLength(4);
    expect(tds.at(0).getDOMNode().children).toHaveLength(1);
    expect(tds.at(0).getDOMNode().children[0].id).toBe('');
    expect(tds.at(1).getDOMNode().children).toHaveLength(1);
    expect(tds.at(1).getDOMNode().children[0].id).toBe('');
  });

  test('render empty data', () => {
    const control: ControlElement = {
      label: false,
      type: 'Control',
      scope: '#/properties/test'
    };
    const store = initJsonFormsVanillaStore({
      data: {},
      schema: fixture.schema,
      uischema: control
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TableArrayControl
            schema={fixture.schema}
            uischema={control}
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    const header = wrapper.find('header').getDOMNode();
    const legendChildren = header.children;
    const label = legendChildren.item(0) as HTMLLabelElement;
    expect(label.tagName).toBe('LABEL');
    expect(label.textContent).toBe('');

    const button = legendChildren.item(1);
    expect(button.tagName).toBe('BUTTON');
    expect(button.textContent).toBe('Add to Test');

    const table = wrapper.find('table').getDOMNode();
    const tableChildren = table.children;
    expect(tableChildren).toHaveLength(2);

    const tHead = tableChildren.item(0);
    expect(tHead.tagName).toBe('THEAD');
    expect(tHead.children).toHaveLength(1);

    const headRow = tHead.children.item(0);
    expect(headRow.tagName).toBe('TR');
    // two data columns + validation column + delete column
    expect(headRow.children).toHaveLength(4);

    const headColumn1 = headRow.children.item(0);
    expect(headColumn1.tagName).toBe('TH');
    expect((headColumn1 as HTMLTableHeaderCellElement).textContent).toBe('X');

    const headColumn2 = headRow.children.item(1);
    expect(headColumn2.tagName).toBe('TH');
    expect((headColumn2 as HTMLTableHeaderCellElement).textContent).toBe('Y');

    const tBody = tableChildren.item(1);
    expect(tBody.tagName).toBe('TBODY');
    expect(tBody.children).toHaveLength(1);
    const noDataRow = tBody.children[0];
    expect(noDataRow.tagName).toBe('TR');
    expect(noDataRow.children).toHaveLength(1);
    const noDataColumn = noDataRow.children[0];
    expect(noDataColumn.tagName).toBe('TD');
    expect(noDataColumn.textContent).toBe('No data');
  });

  test('use property title as a column header if it exists', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture2.data,
      schema: fixture2.schema,
      uischema: fixture2.uischema,
      cells: [
        { tester: integerCellTester, cell: IntegerCell }
      ]
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TableArrayControl
            schema={fixture2.schema}
            uischema={fixture2.uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    //column headings are wrapped in a <thead> tag
    const headers = wrapper.find('thead').find('th');

    // the first property has a title, so we expect it to be rendered as the first column heading
    expect(headers.at(0).text()).toEqual("Column X");

    // the second property has no title, so we expect to see the property name in start case
    expect(headers.at(1).text()).toEqual("Y");
  });

  test('render new child (empty init data)', () => {
    const store = initJsonFormsVanillaStore({
      data: { test: [] },
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TableArrayControl
            schema={fixture.schema}
            uischema={fixture.uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    const control = wrapper.find('.root_properties_test');
    expect(control).toBeDefined();

    const button = wrapper.find('button');
    button.simulate('click');
    expect(getData(store.getState()).test).toHaveLength(1);
  });

  test('render new child (undefined data)', () => {
    const store = initJsonFormsVanillaStore({
      data: { test: undefined },
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TableArrayControl
            schema={fixture.schema}
            uischema={fixture.uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    const control = wrapper.find('.root_properties_test');
    expect(control).toBeDefined();

    const button = wrapper.find('button');
    button.simulate('click');
    expect(getData(store.getState()).test).toHaveLength(1);
  });

  test('render new child (null data)', () => {
    const store = initJsonFormsVanillaStore({
      data: { test: null },
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TableArrayControl
            schema={fixture.schema}
            uischema={fixture.uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    const control = wrapper.find('.root_properties_test');
    expect(control).toBeDefined();

    const button = wrapper.find('button');
    button.simulate('click');
    expect(getData(store.getState()).test).toHaveLength(1);
  });

  test('render new child', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TableArrayControl
            schema={fixture.schema}
            uischema={fixture.uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    const addButton = wrapper.find('button').first();
    addButton.simulate('click');
    expect(getData(store.getState()).test).toHaveLength(2);
  });

  test('render primitives ', () => {
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
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TableArrayControl
            schema={schema}
            uischema={uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const rows = wrapper.find('tr');
    const lastRow = rows.last().getDOMNode() as HTMLTableRowElement;
    expect(lastRow.children.item(1).textContent).toBe('should NOT be longer than 3 characters');
    expect(rows).toHaveLength(3);
  });

  test('update via action', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TableArrayControl
            schema={fixture.schema}
            uischema={fixture.uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    const children = wrapper.find('tbody').getDOMNode();
    expect(children.childNodes).toHaveLength(1);

    store.dispatch(update('test', () => [{ x: 1, y: 3 }, { x: 2, y: 3 }]));
    expect(children.childNodes).toHaveLength(2);

    store.dispatch(update(undefined, () => [{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }]));
    expect(children.childNodes).toHaveLength(2);
  });

  test('hide', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema,
      styles: fixture.styles
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TableArrayControl
            schema={fixture.schema}
            uischema={fixture.uischema}
            visible={false}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const control = wrapper.find('.control').getDOMNode() as HTMLElement;
    expect(control.hidden).toBe(true);
  });

  test('show by default', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema,
      styles: fixture.styles
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TableArrayControl
            schema={fixture.schema}
            uischema={fixture.uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const control = wrapper.find('.control').getDOMNode() as HTMLElement;
    expect(control.hidden).toBe(false);
  });

  test('single error', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TableArrayControl
            schema={fixture.schema}
            uischema={fixture.uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('test', () => 2));
    const validation = wrapper.find('.validation').getDOMNode();
    expect(validation.textContent).toBe('should be array');
  });

  test('multiple errors', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TableArrayControl
            schema={fixture.schema}
            uischema={fixture.uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('test', () => 3));
    const validation = wrapper.find('.validation').getDOMNode();
    expect(validation.textContent).toBe('should be array');
  });

  test('empty errors by default', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TableArrayControl
            schema={fixture.schema}
            uischema={fixture.uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const validation = wrapper.find('.validation').getDOMNode();
    expect(validation.textContent).toBe('');
  });

  test('reset validation message', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TableArrayControl
            schema={fixture.schema}
            uischema={fixture.uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const validation = wrapper.find('.validation').getDOMNode();
    store.dispatch(update('test', () => 3));
    wrapper.update();
    expect(validation.textContent).toBe('should be array');
    store.dispatch(update('test', () => []));
    wrapper.update();
    expect(validation.textContent).toBe('');
  });
  // must be thought through as to where to show validation errors
  test.skip('validation of nested schema', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        personalData: {
          type: 'object',
          properties: {
            middleName: { type: 'string' },
            lastName: { type: 'string' }
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
    wrapper = mount(
      <Provider store={store}>
        <HorizontalLayoutRenderer schema={schema} uischema={uischema} />
      </Provider>
    );
    const validation = wrapper.find('.valdiation');
    expect(validation.at(0).getDOMNode().textContent).toBe('');
    expect(validation.at(1).getDOMNode().textContent).toBe('is a required property');
    expect(validation.at(2).getDOMNode().textContent).toBe('is a required property');
  });
});
