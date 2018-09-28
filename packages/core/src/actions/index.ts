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
import { RankedTester } from '../testers';
import { JsonSchema, UISchemaElement } from '../';
import { generateDefaultUISchema, generateJsonSchema } from '../generators';
import { UISchemaTester } from '../reducers/uischemas';
import * as AJV from 'ajv';

export const INIT: 'jsonforms/INIT' = 'jsonforms/INIT';
export const SET_AJV: 'jsonforms/SET_AJV' = 'jsonforms/SET_AJV';
export const UPDATE_DATA: 'jsonforms/UPDATE' = 'jsonforms/UPDATE';
export const VALIDATE: 'jsonforms/VALIDATE' = 'jsonforms/VALIDATE';
export const ADD_RENDERER: 'jsonforms/ADD_RENDERER' = 'jsonforms/ADD_RENDERER';
export const REMOVE_RENDERER : 'jsonforms/REMOVE_RENDERER' = 'jsonforms/REMOVE_RENDERER';
export const ADD_FIELD : 'jsonforms/ADD_FIELD' = 'jsonforms/ADD_FIELD';
export const REMOVE_FIELD: 'jsonforms/REMOVE_FIELD' = 'jsonforms/REMOVE_FIELD';
export const SET_CONFIG : 'jsonforms/SET_CONFIG' = 'jsonforms/SET_CONFIG';
export const ADD_UI_SCHEMA: 'jsonforms/ADD_UI_SCHEMA' = `jsonforms/ADD_UI_SCHEMA`;
export const REMOVE_UI_SCHEMA: 'jsonforms/REMOVE_UI_SCHEMA' = `jsonforms/REMOVE_UI_SCHEMA`;

export const ADD_DEFAULT_DATA: 'jsonforms/ADD_DEFAULT_DATA' = `jsonforms/ADD_DEFAULT_DATA`;
export const REMOVE_DEFAULT_DATA: 'jsonforms/REMOVE_DEFAULT_DATA' = `jsonforms/REMOVE_DEFAULT_DATA`;

export interface UpdateAction {
  type: 'jsonforms/UPDATE';
  path: string;
  updater(existingData?: any): any;
}

export const init = (
  data: any,
  schema: JsonSchema = generateJsonSchema(data),
  uischema: UISchemaElement = generateDefaultUISchema(schema),
  ajv?: AJV.Ajv
) =>
    ({
      type: INIT,
      data,
      schema,
      uischema,
      ajv
    });

export const setAjv = (
    ajv: AJV.Ajv
) => ({
    type: SET_AJV,
    ajv
});

export const registerDefaultData = (
    schemaPath: string,
    data: any
) => ({
    type: ADD_DEFAULT_DATA,
    schemaPath,
    data
});

export const unregisterDefaultData = (schemaPath: string) => ({
    type: REMOVE_DEFAULT_DATA,
    schemaPath
});

export const update =
  (path: string, updater: (any) => any): UpdateAction => ({
    type: UPDATE_DATA,
    path,
    updater
  });

export const registerRenderer = (
  tester: RankedTester,
  renderer: any
) => ({
  type: ADD_RENDERER,
  tester,
  renderer
});

export const registerField = (
  tester: RankedTester,
  field: any
) => ({
  type: ADD_FIELD,
  tester,
  field
});

export const unregisterField = (
  tester: RankedTester,
  field: any
) => ({
  type: REMOVE_FIELD,
  tester,
  field
});

export const unregisterRenderer = (
  tester: RankedTester,
  renderer: any
) => ({
  type: REMOVE_RENDERER,
  tester,
  renderer
});

export const setConfig = config => dispatch => {
  dispatch({
    type: SET_CONFIG,
    config,
  });
};

export interface AddUISchemaAction {
  type: 'jsonforms/ADD_UI_SCHEMA';
  tester: UISchemaTester;
  uischema: UISchemaElement;
}

export const registerUISchema = (
  tester: UISchemaTester,
  uischema: UISchemaElement
): AddUISchemaAction => {
  return {
    type: ADD_UI_SCHEMA,
    tester,
    uischema
  };
};

export interface RemoveUISchemaAction {
  type: 'jsonforms/REMOVE_UI_SCHEMA';
  tester: UISchemaTester;
}

export const unregisterUISchema = (
  tester: UISchemaTester
): RemoveUISchemaAction => {
  return {
    type: REMOVE_UI_SCHEMA,
    tester,
  };
};
