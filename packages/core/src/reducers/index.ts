import { combineReducers, Reducer } from 'redux';
import { errorAt, subErrorsAt, validationReducer } from './validation';
import { rendererReducer } from './renderers';
import { fieldReducer } from './fields';
import { transformPropsReducer } from './transformProps';
import { commonStateReducer, extractData, extractSchema, extractUiSchema } from './common';
import { JsonFormsState } from '../store';

export const jsonformsReducer = (additionalReducers = {}): Reducer<JsonFormsState> =>
  combineReducers({
    jsonforms: combineReducers({
      common: commonStateReducer,
      validation: validationReducer,
      renderers: rendererReducer,
      fields: fieldReducer,
      transformProps: transformPropsReducer,
      ...additionalReducers
    })
  });

export const getData = state => extractData(state.jsonforms.common);
export const getSchema = state => extractSchema(state.jsonforms.common);
export const getUiSchema = state => extractUiSchema(state.jsonforms.common);

export const getErrorAt = instancePath => state => {
  return errorAt(instancePath)(state.jsonforms.validation);
};
export const getSubErrorsAt = instancePath => state =>
  subErrorsAt(instancePath)(state.jsonforms.validation);

export const getPropsTransformer = state => state.jsonforms.transformProps;
