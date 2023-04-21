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

import type AJV from 'ajv';
import type { ErrorObject } from 'ajv';
import type { JsonSchema, UISchemaElement } from '../models';
import { generateDefaultUISchema, generateJsonSchema } from '../generators';

import type { RankedTester } from '../testers';
import type { UISchemaTester, ValidationMode } from '../reducers';
import type { ErrorTranslator, Translator } from '../i18n';

export const INIT = 'jsonforms/INIT' as const;
export const UPDATE_CORE = 'jsonforms/UPDATE_CORE' as const;
export const SET_AJV = 'jsonforms/SET_AJV' as const;
export const UPDATE_DATA = 'jsonforms/UPDATE' as const;
export const UPDATE_ERRORS = 'jsonforms/UPDATE_ERRORS' as const;
export const VALIDATE = 'jsonforms/VALIDATE' as const;
export const ADD_RENDERER = 'jsonforms/ADD_RENDERER' as const;
export const REMOVE_RENDERER = 'jsonforms/REMOVE_RENDERER' as const;
export const ADD_CELL = 'jsonforms/ADD_CELL' as const;
export const REMOVE_CELL = 'jsonforms/REMOVE_CELL' as const;
export const SET_CONFIG = 'jsonforms/SET_CONFIG' as const;
export const ADD_UI_SCHEMA = 'jsonforms/ADD_UI_SCHEMA' as const;
export const REMOVE_UI_SCHEMA = 'jsonforms/REMOVE_UI_SCHEMA' as const;
export const SET_SCHEMA = 'jsonforms/SET_SCHEMA' as const;
export const SET_UISCHEMA = 'jsonforms/SET_UISCHEMA' as const;
export const SET_VALIDATION_MODE = 'jsonforms/SET_VALIDATION_MODE' as const;

export const SET_LOCALE = 'jsonforms/SET_LOCALE' as const;
export const SET_TRANSLATOR = 'jsonforms/SET_TRANSLATOR' as const;
export const UPDATE_I18N = 'jsonforms/UPDATE_I18N' as const;

export const ADD_DEFAULT_DATA = 'jsonforms/ADD_DEFAULT_DATA' as const;
export const REMOVE_DEFAULT_DATA = 'jsonforms/REMOVE_DEFAULT_DATA' as const;

export type CoreActions =
  | InitAction
  | UpdateCoreAction
  | UpdateAction
  | UpdateErrorsAction
  | SetAjvAction
  | SetSchemaAction
  | SetUISchemaAction
  | SetValidationModeAction;

export interface UpdateAction {
  type: 'jsonforms/UPDATE';
  path: string;
  updater(existingData?: any): any;
}

export interface UpdateErrorsAction {
  type: 'jsonforms/UPDATE_ERRORS';
  errors: ErrorObject[];
}

export interface InitAction {
  type: 'jsonforms/INIT';
  data: any;
  schema: JsonSchema;
  uischema: UISchemaElement;
  options?: InitActionOptions | AJV;
}

export interface UpdateCoreAction {
  type: 'jsonforms/UPDATE_CORE';
  data?: any;
  schema?: JsonSchema;
  uischema?: UISchemaElement;
  options?: InitActionOptions | AJV;
}

export interface InitActionOptions {
  ajv?: AJV;
  validationMode?: ValidationMode;
  additionalErrors?: ErrorObject[];
}

export interface SetValidationModeAction {
  type: 'jsonforms/SET_VALIDATION_MODE';
  validationMode: ValidationMode;
}

export const init = (
  data: any,
  schema: JsonSchema = generateJsonSchema(data),
  uischema?: UISchemaElement,
  options?: InitActionOptions | AJV
) => ({
  type: INIT,
  data,
  schema,
  uischema:
    typeof uischema === 'object' ? uischema : generateDefaultUISchema(schema),
  options,
});

export const updateCore = (
  data: any,
  schema: JsonSchema,
  uischema?: UISchemaElement,
  options?: AJV | InitActionOptions
): UpdateCoreAction => ({
  type: UPDATE_CORE,
  data,
  schema,
  uischema,
  options,
});

export interface RegisterDefaultDataAction {
  type: 'jsonforms/ADD_DEFAULT_DATA';
  schemaPath: string;
  data: any;
}

export const registerDefaultData = (schemaPath: string, data: any) => ({
  type: ADD_DEFAULT_DATA,
  schemaPath,
  data,
});

export interface UnregisterDefaultDataAction {
  type: 'jsonforms/REMOVE_DEFAULT_DATA';
  schemaPath: string;
}

export const unregisterDefaultData = (schemaPath: string) => ({
  type: REMOVE_DEFAULT_DATA,
  schemaPath,
});

export interface SetAjvAction {
  type: 'jsonforms/SET_AJV';
  ajv: AJV;
}

export const setAjv = (ajv: AJV) => ({
  type: SET_AJV,
  ajv,
});

export const update = (
  path: string,
  updater: (existingData: any) => any
): UpdateAction => ({
  type: UPDATE_DATA,
  path,
  updater,
});

export const updateErrors = (errors: ErrorObject[]): UpdateErrorsAction => ({
  type: UPDATE_ERRORS,
  errors,
});

export interface AddRendererAction {
  type: 'jsonforms/ADD_RENDERER';
  tester: RankedTester;
  renderer: any;
}

export const registerRenderer = (tester: RankedTester, renderer: any) => ({
  type: ADD_RENDERER,
  tester,
  renderer,
});

export interface AddCellRendererAction {
  type: 'jsonforms/ADD_CELL';
  tester: RankedTester;
  cell: any;
}

export const registerCell = (tester: RankedTester, cell: any) => ({
  type: ADD_CELL,
  tester,
  cell,
});

export interface RemoveCellRendererAction {
  type: 'jsonforms/REMOVE_CELL';
  tester: RankedTester;
  cell: any;
}

export const unregisterCell = (tester: RankedTester, cell: any) => ({
  type: REMOVE_CELL,
  tester,
  cell,
});

export interface RemoveRendererAction {
  type: 'jsonforms/REMOVE_RENDERER';
  tester: RankedTester;
  renderer: any;
}

export const unregisterRenderer = (tester: RankedTester, renderer: any) => ({
  type: REMOVE_RENDERER,
  tester,
  renderer,
});

export interface SetConfigAction {
  type: 'jsonforms/SET_CONFIG';
  config: any;
}

export const setConfig = (config: any): SetConfigAction => ({
  type: SET_CONFIG,
  config,
});

export const setValidationMode = (
  validationMode: ValidationMode
): SetValidationModeAction => ({
  type: SET_VALIDATION_MODE,
  validationMode,
});

export type UISchemaActions = AddUISchemaAction | RemoveUISchemaAction;

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
    uischema,
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

export type I18nActions =
  | SetLocaleAction
  | SetTranslatorAction
  | UpdateI18nAction;

export interface SetLocaleAction {
  type: 'jsonforms/SET_LOCALE';
  locale: string | undefined;
}

export const setLocale = (locale: string | undefined): SetLocaleAction => ({
  type: SET_LOCALE,
  locale,
});

export interface SetSchemaAction {
  type: 'jsonforms/SET_SCHEMA';
  schema: JsonSchema;
}

export const setSchema = (schema: JsonSchema): SetSchemaAction => ({
  type: SET_SCHEMA,
  schema,
});

export interface SetTranslatorAction {
  type: 'jsonforms/SET_TRANSLATOR';
  translator?: Translator;
  errorTranslator?: ErrorTranslator;
}

export const setTranslator = (
  translator?: Translator,
  errorTranslator?: ErrorTranslator
): SetTranslatorAction => ({
  type: SET_TRANSLATOR,
  translator,
  errorTranslator,
});

export interface UpdateI18nAction {
  type: 'jsonforms/UPDATE_I18N';
  locale: string | undefined;
  translator: Translator | undefined;
  errorTranslator: ErrorTranslator | undefined;
}

export const updateI18n = (
  locale: string | undefined,
  translator: Translator | undefined,
  errorTranslator: ErrorTranslator | undefined
): UpdateI18nAction => ({
  type: UPDATE_I18N,
  locale,
  translator,
  errorTranslator,
});

export interface SetUISchemaAction {
  type: 'jsonforms/SET_UISCHEMA';
  uischema: UISchemaElement;
}

export const setUISchema = (uischema: UISchemaElement): SetUISchemaAction => ({
  type: SET_UISCHEMA,
  uischema,
});
