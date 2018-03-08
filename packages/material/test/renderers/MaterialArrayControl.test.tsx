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
import { Actions, jsonformsReducer, JsonFormsState } from '@jsonforms/core';
import * as React from 'react';
import * as _ from 'lodash';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';

import MaterialArrayControlRenderer from '../../src/complex/MaterialArrayControlRenderer';
import { combineReducers, createStore, Store } from 'redux';
import { materialFields, materialRenderers } from '../../src';

export const initJsonFormsStore = (): Store<JsonFormsState> => {

  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    {
      jsonforms: {
        renderers: materialRenderers,
        fields: materialFields,
      }
    }
  );

  store.dispatch(Actions.init(data, schema, uischema));

  return store;
};

const data = [
  {
    message: 'El Barto was here',
    done: true
  },
  {
    message: 'Yolo'
  }
];
const schema = {
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
};
const uischema = {
  type: 'Control',
  scope: '#'
};

describe('Material array control', () => {

  it('should render', () => {
    const store = initJsonFormsStore();
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialArrayControlRenderer schema={schema} uischema={uischema}/>
      </Provider>
    );

    const rows = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'tr');
    // header + 2 data entries
    expect(rows.length).toBe(3);
  });

  it('should delete an item', () => {
    const store = initJsonFormsStore();
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialArrayControlRenderer schema={schema} uischema={uischema}/>
      </Provider>
    );

    const inputs: HTMLInputElement[] = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
    const cboxes = _.filter(
      inputs,
      i => i.type === 'checkbox'
    );
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'button');
    const deleteButton = buttons[1];
    TestUtils.Simulate.change(cboxes[1], {'target': {'checked': true}});

    TestUtils.Simulate.click(deleteButton);
    const confirmButton = buttons[3];
    TestUtils.Simulate.click(confirmButton);

    const rows = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'tr');
    expect(rows.length).toBe(2);
    expect(store.getState().jsonforms.core.data.length).toBe(1);
  });

  it('should keep selection change', () => {
    const store = initJsonFormsStore();
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialArrayControlRenderer schema={schema} uischema={uischema}/>
      </Provider>
    );

    const inputs: HTMLInputElement[] = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
    const cboxes = _.filter(
      inputs,
      i => i.type === 'checkbox'
    );
    const currentlyChecked = _.head(_.filter(cboxes, cbox => cbox.checked));

    // select all
    TestUtils.Simulate.change(cboxes[0], {'target': {'checked': true}});

    expect(_.filter(cboxes, cbox => cbox.checked).length).toBe(4);
    TestUtils.Simulate.change(currentlyChecked, {'target': {'checked': false}});
    // keep select all state
    expect(_.filter(cboxes, cbox => cbox.checked).length).toBe(3);
  });
});
