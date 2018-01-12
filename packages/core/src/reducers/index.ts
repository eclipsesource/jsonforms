import { combineReducers, Reducer } from 'redux';
import { validationReducer } from './validation';
import { rendererReducer } from './renderers';
import { fieldReducer } from './inputs';
import { findStyle, findStyleAsClassName, stylingReducer } from './styling';
import { commonStateReducer, extractData, extractSchema, extractUiSchema } from './common';

export const appReducer: Reducer<any> = combineReducers(
  {
    'common': commonStateReducer,
    'validation': validationReducer,
    'renderers': rendererReducer,
    'fields': fieldReducer,
    'styles': stylingReducer
  }
);

export const getData = state => {
  return extractData(state.common);
};

export const getSchema = state => extractSchema(state.common);
export const getUiSchema = state => extractUiSchema(state.common);
export const getRuntime = state => state.runtime;
export const getValidation = state => state.validation;
export const getStyle = state => (styleName: string) => findStyle(state.styles)(styleName);
export const getStyleAsClassName = state => (styleName: string, ...args: any[]) =>
  findStyleAsClassName(state.styles)(styleName, args);
