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
      /**
       * JSON schema describing the data.
       */
      schema?: JsonSchema;
      /**
       * The UI schema describing the form to be rendered.
       */
      uischema?: UISchemaElement;
    };
    /**
     * Contains the current validation state.
     */
    validation?: ValidationState,
    /**
     * Contains all available renderers.
     */
    renderers?: any[];
    /**
     * Contains all available field renderers.
     */
    fields?: any[];
    // allow additional state for JSONForms
    [x: string]: any;
  };
}

