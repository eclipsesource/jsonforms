import { CoreActions } from '../actions';
import { JsonFormsCore } from './core';

export interface Middleware {
  (
    state: JsonFormsCore,
    action: CoreActions,
    defaultReducer: (state: JsonFormsCore, action: CoreActions) => JsonFormsCore
  ): JsonFormsCore;
}
export const defaultMiddleware: Middleware = (state, action, defaultReducer) =>
  defaultReducer(state, action);
