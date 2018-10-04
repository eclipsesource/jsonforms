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
import { combineReducers, Reducer } from 'redux';
import { JsonFormsRendererRegistryEntry, rendererReducer } from './renderers';
import { fieldReducer } from './fields';
import { configReducer } from './config';
import {
    defaultDataReducer,
    extractDefaultData,
    JsonFormsDefaultDataRegistryEntry
} from './default-data';
import {
    coreReducer,
    errorAt,
    extractData,
    extractSchema,
    extractUiSchema,
    subErrorsAt
} from './core';
import { JsonFormsState } from '../store';
import { findMatchingUISchema, uischemaRegistryReducer, UISchemaTester } from './uischemas';
import { Generate, JsonSchema, UISchemaElement } from '..';

export {
  rendererReducer,
  fieldReducer,
  coreReducer,
  UISchemaTester
};

export const jsonformsReducer = (additionalReducers = {}): Reducer<JsonFormsState> =>
  combineReducers<JsonFormsState>({
    core: coreReducer,
    renderers: rendererReducer,
    fields: fieldReducer,
    config: configReducer,
    uischemas: uischemaRegistryReducer,
    defaultData: defaultDataReducer,
    ...additionalReducers
  });

export const getData = (state: JsonFormsState) => extractData(state.jsonforms.core);
export const getSchema = (state: JsonFormsState) => extractSchema(state.jsonforms.core);
export const getUiSchema = (state: JsonFormsState) => extractUiSchema(state.jsonforms.core);
export const getDefaultData = (state: JsonFormsState): JsonFormsDefaultDataRegistryEntry[] =>
    extractDefaultData(state.jsonforms.defaultData);
export const getRenderers = (state: JsonFormsState):
    JsonFormsRendererRegistryEntry[] => state.jsonforms.renderers;

export const findUISchema = (state: JsonFormsState) =>
  (schema: JsonSchema,
   schemaPath: string,
   path: string,
   fallbackLayoutType = 'VerticalLayout'
  ): UISchemaElement => {
    const uiSchema = findMatchingUISchema(state.jsonforms.uischemas)(schema, schemaPath, path);
    if (uiSchema === undefined) {
      return Generate.uiSchema(schema, fallbackLayoutType);
    }
    return uiSchema;
  };

export const getErrorAt = (instancePath: string) => (state: JsonFormsState) => {
  return errorAt(instancePath)(state.jsonforms.core);
};
export const getSubErrorsAt = (instancePath: string) => (state: JsonFormsState) =>
  subErrorsAt(instancePath)(state.jsonforms.core);

export const getConfig = (state: JsonFormsState) => state.jsonforms.config;
