import thunk from 'redux-thunk';
import { appReducer } from './reducers/index';
import { applyMiddleware, createStore } from 'redux';
import { JsonFormsStore } from './json-forms';
import { JsonForms } from './core';
import { INIT, VALIDATE } from './actions';
import { JsonSchema } from './models/jsonSchema';
import { UISchemaElement } from './models/uischema';

export const createJsonFormsStore = (initialState): JsonFormsStore => {
  // TODO: typing
  const store = createStore(
    appReducer,
    initialState,
    applyMiddleware(thunk)
  );

  return store as JsonFormsStore;
};

export const initJsonFormsStore =
  (data: any, schema: JsonSchema, uischema: UISchemaElement): JsonFormsStore => {

    const store = createJsonFormsStore({
      common: {
        data
      },
      renderers: JsonForms.renderers,
      fields: JsonForms.fields
    });

    store.dispatch({
      type: INIT,
      data,
      schema,
      uischema
    });

    store.dispatch({
      type: VALIDATE,
      data
    });

    return store;
  };
