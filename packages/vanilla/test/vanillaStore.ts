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
import { combineReducers, createStore, Store } from 'redux';
import {
  Actions,
  jsonFormsReducerConfig,
  JsonFormsState,
  JsonSchema,
  UISchemaElement
} from '@jsonforms/core';
import { vanillaStyles } from '../src/util';
import { stylingReducer } from '../src/reducers';

export const initJsonFormsVanillaStore = ({
  data,
  schema,
  uischema,
  ...other
}: {
  data: any;
  uischema: UISchemaElement;
  schema: JsonSchema;
  [other: string]: any;
}): Store<JsonFormsState> => {
  const store: Store<JsonFormsState> = createStore(
    combineReducers({
      jsonforms: combineReducers({...jsonFormsReducerConfig, styles: stylingReducer}),
    }),
    {
      // TODO
      jsonforms: {
        styles: vanillaStyles,
        ...other
      } as any
    }
  );

  store.dispatch(Actions.init(data, schema, uischema));

  return store;
};
