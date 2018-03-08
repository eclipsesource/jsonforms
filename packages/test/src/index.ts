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
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare let global;
installCE(global, 'force');
global.requestAnimationFrame = cb => setTimeout(cb, 0);
import {
  Actions,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  UISchemaElement
} from '@jsonforms/core';
import { combineReducers, createStore, Store } from 'redux';
import FakeLayout, { fakeLayoutTester } from './FakeLayout';
import FakeControl, { fakeControlTester } from './FakeControl';

/**
 * Describes the initial state of the JSON Form's store.
 */
export interface JsonFormsInitialState {
  /**
   * Data instance to be rendered.
   */
  data: any;

  /**
   * JSON Schema describing the data to be rendered.
   */
  schema?: JsonSchema;

  /**
   * UI Schema describing the UI to be rendered.
   */
  uischema?: UISchemaElement;

  /**
   * Any additional state.
   */
  [x: string]: any;
}

export const testRenderers = [
  { tester: fakeLayoutTester, renderer: FakeLayout },
  { tester: fakeControlTester, renderer: FakeControl }
];

export const initJsonFormsStore = ({
                                     data,
                                     schema,
                                     uischema,
                                     ...props
                                   }: JsonFormsInitialState): Store<JsonFormsState> => {

  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    {
      jsonforms: {
        renderers: testRenderers,
        ...props
      }
    }
  );

  store.dispatch(Actions.init(data, schema, uischema));

  return store;
};

export { FakeControl, FakeLayout, fakeLayoutTester, fakeControlTester };
