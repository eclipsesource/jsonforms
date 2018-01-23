<<<<<<< HEAD
import { Store } from 'redux';
=======
import thunk from 'redux-thunk';
import { jsonformsReducer } from './reducers';
import { applyMiddleware, createStore, Store } from 'redux';
import { JsonForms } from './core';
import { INIT, SET_LOCALE, VALIDATE } from './actions';
>>>>>>> set locale default value
import { JsonSchema } from './models/jsonSchema';
import { UISchemaElement } from './models/uischema';

export interface JsonFormsStore extends Store<any> {
}
export interface JsonFormsState {
  jsonforms: {
    common: {
      data: any;
      schema?: JsonSchema;
      uischema?: UISchemaElement;
    };
    renderers?: any[];
    fields?: any[];
    i18n: {
      translations?: any;
      locale?: String;
    };
    // allow additional state for JSONForms
    [x: string]: any;
  };
}

export interface JsonFormsInitialState {
  data: any;
  schema?: JsonSchema;
  uischema?: UISchemaElement;
  translations?: any;
  locale?: String;
  // allow additional state
  [x: string]: any;
}
