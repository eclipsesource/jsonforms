import { Store } from 'redux';
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
      config?: any;
    };
    renderers?: any[];
    fields?: any[];
    // allow additional state for JSONForms
    [x: string]: any;
  };
}

export interface JsonFormsInitialState {
  data: any;
  schema?: JsonSchema;
  uischema?: UISchemaElement;
  config?: any;
  // allow additional state
  [x: string]: any;
}
