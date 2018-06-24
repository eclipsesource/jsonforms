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
  Generate,
  jsonformsReducer,
  JsonFormsState
} from '@jsonforms/core';
import * as React from 'react';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';

import { combineReducers, createStore, Store } from 'redux';
import { materialFields, materialRenderers } from '../../src';
import { MaterialArrayLayout, materialArrayLayoutTester } from '../../src/layouts';

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

const nestedSchema = {
  type: 'array',
  items: {
    ...schema
  }
};

const uischema = {
  type: 'Control',
  scope: '#'
};

const nestedSchema2 = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      objectarrayofstrings: {
        type: 'object',
        properties: {
          choices: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      }
    }
  }
};

describe('Material array layout', () => {
  it('should only be applicable for intermediate array', () => {
    expect(materialArrayLayoutTester(uischema, schema)).toBe(-1);
    expect(materialArrayLayoutTester(uischema, nestedSchema)).toBe(4);
    expect(materialArrayLayoutTester(uischema, nestedSchema2)).toBe(4);
  });
  it('should render two by two children', () => {
    const store = initJsonFormsStore();
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialArrayLayout schema={schema} uischema={uischema}/>
      </Provider>
    );

    const controls = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
    // 2 data entries with each having 2 controls
    expect(controls.length).toBe(4);
  });
});
