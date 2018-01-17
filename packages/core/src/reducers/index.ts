import { combineReducers, Reducer } from 'redux';
import { validationReducer } from './validation';
import { rendererReducer } from './renderers';
import { fieldReducer } from './inputs';
import { commonStateReducer, extractData, extractSchema, extractUiSchema } from './common';
import { JsonForms } from '../core';
import { JsonFormsState } from '../store';
export {
  validationReducer,
  rendererReducer,
  fieldReducer,
  commonStateReducer,
};

export const jsonformsReducer: Reducer<JsonFormsState> =
  combineReducers({
    common: commonStateReducer,
    validation: validationReducer,
    renderers: rendererReducer,
    fields: fieldReducer,
    ...JsonForms.reducers,
  });

export const getData = state => extractData(state.common);

export const getSchema = state => extractSchema(state.common);
export const getUiSchema = state => extractUiSchema(state.common);
export const getValidation = state => state.validation;
