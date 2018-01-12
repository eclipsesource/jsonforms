import thunk from 'redux-thunk';
import { appReducer } from './reducers';
import { applyMiddleware, createStore } from 'redux';
import { JsonFormsStore } from './json-forms';
import { JsonForms } from './core';
import { INIT, VALIDATE } from './actions';
import { JsonSchema } from './models/jsonSchema';
import { UISchemaElement } from './models/uischema';
import { generateDefaultUISchema, generateJsonSchema } from './generators';

export const createJsonFormsStore = (initialState): JsonFormsStore => {
  // TODO: typing
  const store = createStore(
    appReducer,
    initialState,
    applyMiddleware(thunk)
  );

  return store as JsonFormsStore;
};

export interface JsonFormsState {
  data: any;
  schema?: JsonSchema;
  uischema?: UISchemaElement;
  styles?: { name: string, classNames: string[] }[];
}

export const initJsonFormsStore = ({
                                     data,
                                     schema = generateJsonSchema(data),
                                     uischema = generateDefaultUISchema(schema),
                                     ...props
                                   }: JsonFormsState
): JsonFormsStore => {

    const store = createJsonFormsStore({
      common: {
        data
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
