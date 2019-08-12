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
import { cellReducer } from './cells';
import get from 'lodash/get';
import {
  defaultDataReducer,
  extractDefaultData,
  JsonFormsDefaultDataRegistryEntry
} from './default-data';
import { combineReducers, Reducer } from 'redux';
import { JsonFormsRendererRegistryEntry, rendererReducer } from './renderers';
import RefParser from 'json-schema-ref-parser';
import { configReducer } from './config';
import {
  coreReducer,
  errorAt,
  errorsAt,
  extractData,
  extractRefParserOptions,
  extractSchema,
  extractUiSchema,
  JsonFormsCore,
  subErrorsAt
} from './core';
import { JsonFormsState, JsonFormsSubStates } from '../store';
import {
  findMatchingUISchema,
  uischemaRegistryReducer,
  UISchemaTester
} from './uischemas';
import {
  fetchLocale,
  findLocalizedSchema,
  findLocalizedUISchema,
  i18nReducer
} from './i18n';

import { JsonSchema } from '../models/jsonSchema';
import { ControlElement, UISchemaElement } from '../models/uischema';
import { Generate } from '../generators';

export {
  rendererReducer,
  cellReducer,
  coreReducer,
  UISchemaTester,
  findMatchingUISchema
};
export { JsonFormsCore };

export const jsonformsReducer = (
  additionalReducers = {}
): Reducer<JsonFormsSubStates> =>
  combineReducers<JsonFormsSubStates>({
    core: coreReducer,
    renderers: rendererReducer,
    cells: cellReducer,
    config: configReducer,
    uischemas: uischemaRegistryReducer,
    defaultData: defaultDataReducer,
    i18n: i18nReducer,
    ...additionalReducers
  });

export const getData = (state: JsonFormsState) =>
  extractData(get(state, 'jsonforms.core'));
export const getSchema = (state: JsonFormsState): JsonSchema =>
  extractSchema(get(state, 'jsonforms.core'));
export const getUiSchema = (state: JsonFormsState): UISchemaElement =>
  extractUiSchema(get(state, 'jsonforms.core'));
export const getRefParserOptions = (state: JsonFormsState): RefParser.Options =>
  extractRefParserOptions(get(state, 'jsonforms.core'));
export const getDefaultData = (
  state: JsonFormsState
): JsonFormsDefaultDataRegistryEntry[] =>
  extractDefaultData(get(state, 'jsonforms.defaultData'));
export const getRenderers = (
  state: JsonFormsState
): JsonFormsRendererRegistryEntry[] => get(state, 'jsonforms.renderers');

/**
 * Finds a registered UI schema to use, if any.
 * @param schema the JSON schema describing the data to be rendered
 * @param schemaPath the according schema path
 * @param path the instance path
 * @param fallbackLayoutType the type of the layout to use
 * @param control may be checked for embedded inline uischema options
 */
export const findUISchema = (
  uischemas: { tester: UISchemaTester; uischema: UISchemaElement }[],
  schema: JsonSchema,
  schemaPath: string,
  path: string,
  fallbackLayoutType = 'VerticalLayout',
  control?: ControlElement,
  rootSchema?: JsonSchema
): UISchemaElement => {
  // handle options
  if (control && control.options && control.options.detail) {
    if (typeof control.options.detail === 'string') {
      if (control.options.detail.toUpperCase() === 'GENERATE') {
        // force generation of uischema
        return Generate.uiSchema(schema, fallbackLayoutType);
      }
    } else if (typeof control.options.detail === 'object') {
      // check if detail is a valid uischema
      if (
        control.options.detail.type &&
        typeof control.options.detail.type === 'string'
      ) {
        return control.options.detail as UISchemaElement;
      }
    }
  }
  // default
  const uiSchema = findMatchingUISchema(uischemas)(schema, schemaPath, path);
  if (uiSchema === undefined) {
    return Generate.uiSchema(schema, fallbackLayoutType, '#', rootSchema);
  }
  return uiSchema;
};

export const getErrorAt = (instancePath: string, schema: JsonSchema) => (
  state: JsonFormsState
) => {
  return errorAt(instancePath, schema)(state.jsonforms.core);
};

export { errorsAt };

export const getSubErrorsAt = (instancePath: string, schema: JsonSchema) => (
  state: JsonFormsState
) => subErrorsAt(instancePath, schema)(state.jsonforms.core);

export const getConfig = (state: JsonFormsState) => state.jsonforms.config;

export const getLocale = (state: JsonFormsState) =>
  fetchLocale(get(state, 'jsonforms.i18n'));

export const getLocalizedSchema = (locale: string) => (
  state: JsonFormsState
): JsonSchema => findLocalizedSchema(locale)(get(state, 'jsonforms.i18n'));

export const getLocalizedUISchema = (locale: string) => (
  state: JsonFormsState
): UISchemaElement =>
  findLocalizedUISchema(locale)(get(state, 'jsonforms.i18n'));
