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
import * as React from 'react';
import {
  Actions,
  ControlElement,
  isEnumControl,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  rankWith,
  UISchemaElement,
  update
} from '@jsonforms/core';
import MaterialRadioGroupControl from '../../src/controls/MaterialRadioGroupControl';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';
import * as _ from 'lodash';
import { materialFields, materialRenderers } from '../../src';
import { combineReducers, createStore, Store } from 'redux';

const data = { foo: 'D' };
const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      enum: ['A', 'B', 'C', 'D']
    }
  }
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};

const initJsonFormsStore = (testData: any, testSchema: JsonSchema, testUiSchema: UISchemaElement): Store<JsonFormsState> => {
  const s: JsonFormsState = {
    jsonforms: {
      renderers: [
        ...materialRenderers,
        {
          tester: rankWith(10, isEnumControl),
          renderer: MaterialRadioGroupControl
        }
      ],
      fields: materialFields
    }
  };
  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    s
  );
  store.dispatch(Actions.init(testData, testSchema, testUiSchema));
  return store;
};

describe('Material radio group control', () => {
  it('Radio group should have data option selected', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialRadioGroupControl schema={schema} uischema={uischema} />
      </Provider>
    ) as React.Component<any, any, any>;

    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input') as HTMLInputElement[];
    const radioButtons = _.filter(inputs, i => i.type === 'radio');
    expect(radioButtons.length).toBe(4);
    // make sure one option is selected and it is "D"
    const currentlyChecked = _.filter(radioButtons, radio => radio.checked);
    expect(currentlyChecked.length).toBe(1);
    expect(currentlyChecked[0].value).toBe('D');
  });
});

describe('Material radio group control selection', () => {
  it('Radio group should have only one selected option ', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialRadioGroupControl schema={schema} uischema={uischema} />
      </Provider>
    ) as React.Component<any, any, any>;

    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input') as HTMLInputElement[];
    const radioButtons = _.filter(inputs, i => i.type === 'radio');

    // change and verify selection
    store.dispatch(update('foo', () => 'A'));
    store.dispatch(update('foo', () => 'B'));
    const currentlyChecked = _.filter(radioButtons, radio => radio.checked);
    expect(currentlyChecked.length).toBe(1);
    expect(currentlyChecked[0].value).toBe('B');
  });
});
