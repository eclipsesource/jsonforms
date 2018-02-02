import { Store } from 'redux';
import { JsonSchema } from './models/jsonSchema';
import { UISchemaElement } from './models/uischema';
import { ValidationState } from './reducers/validation';

/**
 * JSONForms store.
 */
export interface JsonFormsStore extends Store<JsonFormsState> {
}

/**
 * The state shape of JSONForms.
 */
export interface JsonFormsState {
  /**
   * Represents JSONForm's substate.
   */
  jsonforms: {
    /**
     * Substate for storing common data.
     */
    common?: {
      /**
       * The actual data to be rendered.
       */
      data: any;
      schema?: JsonSchema;
      uischema?: UISchemaElement;
    };
    validation?: ValidationState,
    renderers?: any[];
    fields?: any[];
    // allow additional state for JSONForms
    [additionalState: string]: any;
  };
}
