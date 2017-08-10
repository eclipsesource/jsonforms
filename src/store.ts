import thunk from 'redux-thunk';
import { appReducer } from './reducers/index';
import { applyMiddleware, createStore } from 'redux';
import { JsonFormsStore } from './json-forms';

export const createJsonFormsStore = (initialState): JsonFormsStore => {
  // TODO: typing
  const store = createStore(
    appReducer,
    initialState,
    applyMiddleware(thunk)
  );

  return store as JsonFormsStore;
};
