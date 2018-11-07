/*
  The MIT License

  Copyright (c) 2018 EclipseSource Munich
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
import {
    Actions,
    ControlElement,
    jsonformsReducer,
    JsonFormsState,
    JsonSchema
} from '@jsonforms/core';
import * as React from 'react';
import * as _ from 'lodash';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';

import MaterialArrayControlRenderer from '../../src/complex/MaterialArrayControlRenderer';
import { combineReducers, createStore, Store } from 'redux';
import { materialFields, materialRenderers } from '../../src';

export const initJsonFormsStore = (customData?: any): Store<JsonFormsState> => {

  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    {
      jsonforms: {
        renderers: materialRenderers,
        fields: materialFields,
      }
    }
  );

  const { data, schema, uischema } = fixture;
  store.dispatch(Actions.init(customData ? customData : data, schema, uischema));

  return store;
};

const fixture: {
    data: any,
    schema: JsonSchema,
    uischema: ControlElement
} = {
    data: [
        {
            message: 'El Barto was here',
            done: true
        },
        {
            message: 'Yolo'
        }
    ],
    schema: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    maxLength: 3
                },
                done: {
                    type: 'boolean'
                }
            }
        }
    },
    uischema: {
        type: 'Control',
        scope: '#'
    }
};

describe('Material array control', () => {

  it('should render', () => {
    const store = initJsonFormsStore();
    const tree: React.Component<any> = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialArrayControlRenderer schema={fixture.schema} uischema={fixture.uischema}/>
      </Provider>
    ) as React.Component<any>;

    const rows = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'tr');
    // 2 header rows + 2 data entries
    expect(rows.length).toBe(4);
  });

  it('should render empty', () => {
    const store = initJsonFormsStore([]);

    const tree: React.Component<any> = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialArrayControlRenderer schema={fixture.schema} uischema={fixture.uischema}/>
      </Provider>
    ) as React.Component<any>;

    const rows: HTMLTableRowElement[] =
        TestUtils.scryRenderedDOMComponentsWithTag(tree, 'tr') as HTMLTableRowElement[];
    // two header rows + no data row
    expect(rows.length).toBe(3);
    const headerColumns = rows[1].cells;
    // 3 columsn  = message & done properties + column for delete button
    expect(headerColumns.length).toBe(3);
  });

  it('should render empty primitives', () => {
    const store = initJsonFormsStore();
    // re-init
    const data: any = { test: [] };
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        test: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/test'
    };
    store.dispatch(Actions.init(data, schema, uischema));

    const tree: React.Component<any> = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialArrayControlRenderer schema={schema} uischema={uischema}/>
      </Provider>
    ) as React.Component<any>;

    const rows: HTMLTableRowElement[] =
        TestUtils.scryRenderedDOMComponentsWithTag(tree, 'tr') as HTMLTableRowElement[];
    // header + no data row
    expect(rows.length).toBe(2);
    const emptyDataCol = rows[1].cells;
    expect(emptyDataCol.length).toBe(1);
    // selection column + 1 data column
    expect(emptyDataCol[0].colSpan).toBe(2);
  });

  it('should render primitives', () => {
    const store = initJsonFormsStore();
    // re-init
    const data = { test: ['foo', 'bar'] };
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/test'
    };
    store.dispatch(Actions.init(data, schema, uischema));

    const tree: React.Component<any> = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialArrayControlRenderer schema={schema} uischema={uischema}/>
      </Provider>
    ) as React.Component<any>;

    const rows = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'tr');
    // header + 2 data entries
    expect(rows.length).toBe(3);
  });

  it('should delete an item', () => {
    const store = initJsonFormsStore();
    const tree: React.Component<any> = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialArrayControlRenderer schema={fixture.schema} uischema={fixture.uischema} />
      </Provider>
    ) as React.Component<any>;

    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'button');
    // 5 buttons
      // add row
      // delete row
      // delete row
      // two dialog buttons (no + yes)
    const deleteButton = buttons[1];
    const nrOfRowsBeforeDelete = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'tr').length;

    TestUtils.Simulate.click(deleteButton);
    const confirmButton = buttons[4];
    TestUtils.Simulate.click(confirmButton);

    const nrOfRowsAfterDelete = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'tr').length;

    expect(nrOfRowsBeforeDelete).toBe(4);
    expect(nrOfRowsAfterDelete).toBe(3);
    expect(store.getState().jsonforms.core.data.length).toBe(1);
  });
});
