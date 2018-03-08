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
import { rendererReducer } from './renderers';
import { fieldReducer } from './fields';
import { transformPropsReducer } from './transformProps';
import { configReducer } from './config';
import {
  coreReducer,
  errorAt,
  extractData,
  extractSchema,
  extractUiSchema,
  subErrorsAt
} from './core';
import { JsonFormsState } from '../store';

export {
  rendererReducer,
  fieldReducer,
  coreReducer
};

export const jsonformsReducer = (additionalReducers = {}): Reducer<JsonFormsState> =>
  combineReducers<JsonFormsState>({
    core: coreReducer,
    renderers: rendererReducer,
    fields: fieldReducer,
    transformProps: transformPropsReducer,
    config: configReducer,
    ...additionalReducers
  });

export const getData = state => extractData(state.jsonforms.core);
export const getSchema = state => extractSchema(state.jsonforms.core);
export const getUiSchema = state => extractUiSchema(state.jsonforms.core);

export const getErrorAt = instancePath => state => {
  return errorAt(instancePath)(state.jsonforms.core);
};
export const getSubErrorsAt = instancePath => state =>
  subErrorsAt(instancePath)(state.jsonforms.core);

export const getPropsTransformer = state => state.jsonforms.transformProps;
export const getConfig = state => state.jsonforms.config;
