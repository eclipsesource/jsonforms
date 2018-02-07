import { combineReducers, Reducer } from 'redux';
import { rendererReducer } from './renderers';
import { fieldReducer } from './fields';
import { transformPropsReducer } from './transformProps';
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
