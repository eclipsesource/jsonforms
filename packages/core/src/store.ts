import thunk from 'redux-thunk';
import { jsonformsReducer } from './reducers';
import { applyMiddleware, createStore } from 'redux';
import { JsonFormsStore } from './json-forms';
import { JsonForms } from './core';
import { INIT, VALIDATE } from './actions';
import { JsonSchema } from './models/jsonSchema';
import { UISchemaElement } from './models/uischema';
import { generateDefaultUISchema, generateJsonSchema } from './generators';

export const createJsonFormsStore = (initialState: JsonFormsState): JsonFormsStore => {
  // TODO: typing
  const store = createStore(
    jsonformsReducer,
    initialState,
    applyMiddleware(thunk)
  );

  return store as JsonFormsStore;
};

export interface JsonFormsState {
  common: {
    data: any;
    schema?: JsonSchema;
    uischema?: UISchemaElement;
  };
  renderers: any[];
  fields: any[];
  // allow additional state
  [x: string]: any;
}

export interface JsonFormsInitialState {
  data: any;
  schema?: JsonSchema;
  uischema?: UISchemaElement;
  // allow additional state
  [x: string]: any;
}

export const initJsonFormsStore = ({
                                     data,
                                     schema = generateJsonSchema(data),
                                     uischema = generateDefaultUISchema(schema),
                                     ...props
                                   }: JsonFormsInitialState
): JsonFormsStore => {

    const store = createJsonFormsStore({
      common: {
        data,
        schema,
        uischema
      },
      renderers: JsonForms.renderers,
      fields: JsonForms.fields,
      ...props
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
