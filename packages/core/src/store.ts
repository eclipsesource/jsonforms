import { Store } from 'redux';
import { JsonSchema } from './models/jsonSchema';
import { UISchemaElement } from './models/uischema';
import { ValidationState } from './reducers/validation';

export interface JsonFormsStore extends Store<any> {
}
export interface JsonFormsState {
  jsonforms: {
    common: {
      data: any;
      schema?: JsonSchema;
      uischema?: UISchemaElement;
    };
    validation?: ValidationState,
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
  // allow additional state
  [x: string]: any;
  translations?: any;
  locale?: String;
}
