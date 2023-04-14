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

import get from 'lodash/get';
import type Ajv from 'ajv';
import type { JsonFormsState } from '../store';
import type { JsonSchema, UISchemaElement } from '../models';
import {
  extractAjv,
  extractData,
  extractSchema,
  extractUiSchema,
} from './core';
import {
  extractDefaultData,
  JsonFormsDefaultDataRegistryEntry,
} from './default-data';
import type { JsonFormsRendererRegistryEntry } from './renderers';
import type { JsonFormsCellRendererRegistryEntry } from './cells';
import type { JsonFormsUISchemaRegistryEntry } from './uischemas';

export const getData = (state: JsonFormsState) =>
  extractData(get(state, 'jsonforms.core'));
export const getSchema = (state: JsonFormsState): JsonSchema =>
  extractSchema(get(state, 'jsonforms.core'));
export const getUiSchema = (state: JsonFormsState): UISchemaElement =>
  extractUiSchema(get(state, 'jsonforms.core'));
export const getAjv = (state: JsonFormsState): Ajv =>
  extractAjv(get(state, 'jsonforms.core'));
export const getDefaultData = (
  state: JsonFormsState
): JsonFormsDefaultDataRegistryEntry[] =>
  extractDefaultData(get(state, 'jsonforms.defaultData'));
export const getRenderers = (
  state: JsonFormsState
): JsonFormsRendererRegistryEntry[] => get(state, 'jsonforms.renderers');
export const getCells = (
  state: JsonFormsState
): JsonFormsCellRendererRegistryEntry[] => get(state, 'jsonforms.cells');
export const getUISchemas = (
  state: JsonFormsState
): JsonFormsUISchemaRegistryEntry[] => get(state, 'jsonforms.uischemas');
