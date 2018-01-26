import { combineReducers, Reducer } from 'redux';
import { errorAt, subErrorsAt, validationReducer } from './validation';
import { rendererReducer } from './renderers';
import { fieldReducer } from './fields';
import { commonStateReducer, extractData, extractSchema, extractUiSchema } from './common';
import { JsonForms } from '../core';
import { JsonFormsState } from '../store';
import { fetchTranslation, i18nReducer } from './i18n';
export {
  validationReducer,
  rendererReducer,
  fieldReducer,
  commonStateReducer,
  i18nReducer
};

export const jsonformsReducer = (): Reducer<JsonFormsState> =>
  combineReducers({
    jsonforms: combineReducers({
      common: commonStateReducer,
      validation: validationReducer,
      renderers: rendererReducer,
      fields: fieldReducer,
      i18n: i18nReducer,
      ...JsonForms.reducers
    })
  });

export const getData = state => extractData(state.jsonforms.common);
export const getSchema = state => extractSchema(state.jsonforms.common);
export const getUiSchema = state => extractUiSchema(state.jsonforms.common);

export const getErrorAt = instancePath => state => {
  return errorAt(instancePath)(state.jsonforms.validation);
};
export const getSubErrorsAt = instancePath => state => subErrorsAt(instancePath)(state.jsonforms.validation);

export const getTranslations = state => fetchTranslation(state.jsonforms.i18n);
