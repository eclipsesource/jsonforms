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
import AJV from 'ajv';
import { RankedTester } from '../testers';
import { JsonSchema, UISchemaElement } from '../';
import { generateDefaultUISchema, generateJsonSchema } from '../generators';
import { UISchemaTester } from '../reducers/uischemas';
import { AnyAction, Dispatch } from 'redux';

export const INIT: 'jsonforms/INIT' = 'jsonforms/INIT';
export const SET_AJV: 'jsonforms/SET_AJV' = 'jsonforms/SET_AJV';
export const UPDATE_DATA: 'jsonforms/UPDATE' = 'jsonforms/UPDATE';
export const VALIDATE: 'jsonforms/VALIDATE' = 'jsonforms/VALIDATE';
export const ADD_RENDERER: 'jsonforms/ADD_RENDERER' = 'jsonforms/ADD_RENDERER';
export const REMOVE_RENDERER: 'jsonforms/REMOVE_RENDERER' =
  'jsonforms/REMOVE_RENDERER';
export const ADD_FIELD: 'jsonforms/ADD_FIELD' = 'jsonforms/ADD_FIELD';
export const REMOVE_FIELD: 'jsonforms/REMOVE_FIELD' = 'jsonforms/REMOVE_FIELD';
export const SET_CONFIG: 'jsonforms/SET_CONFIG' = 'jsonforms/SET_CONFIG';
export const ADD_UI_SCHEMA: 'jsonforms/ADD_UI_SCHEMA' = `jsonforms/ADD_UI_SCHEMA`;
export const REMOVE_UI_SCHEMA: 'jsonforms/REMOVE_UI_SCHEMA' = `jsonforms/REMOVE_UI_SCHEMA`;
export const SET_SCHEMA: 'jsonforms/SET_SCHEMA' = `jsonforms/SET_SCHEMA`;
export const SET_UISCHEMA: 'jsonforms/SET_UISCHEMA' = `jsonforms/SET_UISCHEMA`;

export const SET_LOCALE: 'jsonforms/SET_LOCALE' = `jsonforms/SET_LOCALE`;
export const SET_LOCALIZED_SCHEMAS: 'jsonforms/SET_LOCALIZED_SCHEMAS' =
  'jsonforms/SET_LOCALIZED_SCHEMAS';
export const SET_LOCALIZED_UISCHEMAS: 'jsonforms/SET_LOCALIZED_UISCHEMAS' =
  'jsonforms/SET_LOCALIZED_UISCHEMAS';

export const ADD_DEFAULT_DATA: 'jsonforms/ADD_DEFAULT_DATA' = `jsonforms/ADD_DEFAULT_DATA`;
export const REMOVE_DEFAULT_DATA: 'jsonforms/REMOVE_DEFAULT_DATA' = `jsonforms/REMOVE_DEFAULT_DATA`;

export interface UpdateAction {
  type: 'jsonforms/UPDATE';
  path: string;
  updater(existingData?: any): any;
}

export interface InitAction {
  type: 'jsonforms/INIT';
  data: any;
  schema: JsonSchema;
  uischema: UISchemaElement;
  ajv?: AJV.Ajv;
}

export const init = (
  data: any,
  schema: JsonSchema = generateJsonSchema(data),
  uischema: UISchemaElement = generateDefaultUISchema(schema),
  ajv?: AJV.Ajv
) => ({
  type: INIT,
  data,
  schema,
  uischema,
  ajv
});

export interface RegisterDefaultDataAction {
  type: 'jsonforms/ADD_DEFAULT_DATA';
  schemaPath: string;
  data: any;
}

export const registerDefaultData = (schemaPath: string, data: any) => ({
  type: ADD_DEFAULT_DATA,
  schemaPath,
  data
});

export interface UnregisterDefaultDataAction {
  type: 'jsonforms/REMOVE_DEFAULT_DATA';
  schemaPath: string;
}

export const unregisterDefaultData = (schemaPath: string) => ({
  type: REMOVE_DEFAULT_DATA,
  schemaPath
});

export interface SetAjvAction {
  type: 'jsonforms/SET_AJV';
  ajv: AJV.Ajv;
}

export const setAjv = (ajv: AJV.Ajv) => ({
  type: SET_AJV,
  ajv
});

export const update = (
  path: string,
  updater: (existingData: any) => any
): UpdateAction => ({
  type: UPDATE_DATA,
  path,
  updater
});

export interface AddRendererAction {
  type: 'jsonforms/ADD_RENDERER';
  tester: RankedTester;
  renderer: any;
}

export const registerRenderer = (tester: RankedTester, renderer: any) => ({
  type: ADD_RENDERER,
  tester,
  renderer
});

export interface AddFieldRendererAction {
  type: 'jsonforms/ADD_FIELD';
  tester: RankedTester;
  field: any;
}

export const registerField = (tester: RankedTester, field: any) => ({
  type: ADD_FIELD,
  tester,
  field
});

export interface RemoveFieldRendererAction {
  type: 'jsonforms/REMOVE_FIELD';
  tester: RankedTester;
  field: any;
}

export const unregisterField = (tester: RankedTester, field: any) => ({
  type: REMOVE_FIELD,
  tester,
  field
});

export interface RemoveRendererAction {
  type: 'jsonforms/REMOVE_RENDERER';
  tester: RankedTester;
  renderer: any;
}

export const unregisterRenderer = (tester: RankedTester, renderer: any) => ({
  type: REMOVE_RENDERER,
  tester,
  renderer
});

export interface SetConfigAction {
  type: 'jsonforms/SET_CONFIG';
  config: any;
}

export const setConfig = (config: any) => (dispatch: Dispatch<AnyAction>) => {
  dispatch({
    type: SET_CONFIG,
    config
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
    tester
  };
};

export interface SetLocaleAction {
  type: 'jsonforms/SET_LOCALE';
  locale: string;
}

export const setLocale = (locale: string): SetLocaleAction => ({
  type: SET_LOCALE,
  locale
});

export interface SetLocalizedSchemasAction {
  type: 'jsonforms/SET_LOCALIZED_SCHEMAS';
  localizedSchemas: Map<string, JsonSchema>;
}

export const setLocalizedSchemas = (
  localizedSchemas: Map<string, JsonSchema>
): SetLocalizedSchemasAction => ({
  type: SET_LOCALIZED_SCHEMAS,
  localizedSchemas
});

export interface SetSchemaAction {
  type: 'jsonforms/SET_SCHEMA';
  schema: JsonSchema;
}

export const setSchema = (schema: JsonSchema): SetSchemaAction => ({
  type: SET_SCHEMA,
  schema
});

export interface SetLocalizedUISchemasAction {
  type: 'jsonforms/SET_LOCALIZED_UISCHEMAS';
  localizedUISchemas: Map<string, UISchemaElement>;
}

export const setLocalizedUISchemas = (
  localizedUISchemas: Map<string, UISchemaElement>
): SetLocalizedUISchemasAction => ({
  type: SET_LOCALIZED_UISCHEMAS,
  localizedUISchemas
});

export interface SetUISchemaAction {
  type: 'jsonforms/SET_UISCHEMA';
  uischema: UISchemaElement;
}

export const setUISchema = (uischema: UISchemaElement): SetUISchemaAction => ({
  type: SET_UISCHEMA,
  uischema
});
