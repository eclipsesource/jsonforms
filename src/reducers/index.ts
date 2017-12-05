import { combineReducers, Reducer } from 'redux';
import { validationReducer } from './validation';
import { rendererReducer } from './renderers';
import { fieldReducer } from './inputs';
import { commonStateReducer, extractData, extractSchema, extractUiSchema } from './common';

export const appReducer: Reducer<any> = combineReducers(
  {
    'common': commonStateReducer,
    'validation': validationReducer,
    'renderers': rendererReducer,
    'fields': fieldReducer
  }
);

export const getData = state => {
  return extractData(state.common);
};

export const getSchema = state => extractSchema(state.common);
export const getUiSchema = state => extractUiSchema(state.common);
export const getRuntime = state => state.runtime;
export const getValidation = state => state.validation;
