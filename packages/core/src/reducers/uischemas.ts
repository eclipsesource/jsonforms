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

import maxBy from 'lodash/maxBy';
import remove from 'lodash/remove';
import { ADD_UI_SCHEMA, REMOVE_UI_SCHEMA, UISchemaActions } from '../actions';
import { NOT_APPLICABLE } from '../testers';
import type { JsonSchema, UISchemaElement } from '../models';
import type { Reducer } from '../util';

export type UISchemaTester = (
  schema: JsonSchema,
  schemaPath: string,
  path: string
) => number;

export interface JsonFormsUISchemaRegistryEntry {
  tester: UISchemaTester;
  uischema: UISchemaElement;
}

export const uischemaRegistryReducer: Reducer<
  JsonFormsUISchemaRegistryEntry[],
  UISchemaActions
> = (state = [], action) => {
  switch (action.type) {
    case ADD_UI_SCHEMA:
      return state
        .slice()
        .concat({ tester: action.tester, uischema: action.uischema });
    case REMOVE_UI_SCHEMA: {
      const copy = state.slice();
      remove(copy, (entry) => entry.tester === action.tester);
      return copy;
    }
    default:
      return state;
  }
};

export const findMatchingUISchema =
  (state: JsonFormsUISchemaRegistryEntry[]) =>
  (
    jsonSchema: JsonSchema,
    schemaPath: string,
    path: string
  ): UISchemaElement => {
    const match = maxBy(state, (entry) =>
      entry.tester(jsonSchema, schemaPath, path)
    );
    if (
      match !== undefined &&
      match.tester(jsonSchema, schemaPath, path) !== NOT_APPLICABLE
    ) {
      return match.uischema;
    }
    return undefined;
  };
