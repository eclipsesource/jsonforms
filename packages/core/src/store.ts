import { Store } from 'redux';
import { JsonSchema } from './models/jsonSchema';
import { UISchemaElement } from './models/uischema';
import { ErrorObject } from 'ajv';

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
   * Represents JSONForm's sub-state.
   */
  jsonforms: {
    /**
     * Substate for storing mandatory sub-state.
     */
    core?: {
      /**
       * The actual data to be rendered.
       */
      data: any;
      /**
       * The JSON schema describing the data.
       */
      schema?: JsonSchema;
      /**
       * The UI schema that describes the UI to be rendered.
       */
      uischema?: UISchemaElement;
      /**
       * Any errors in case the data violates the JSON schema.
       */
      errors?: ErrorObject[]
    };
    /**
     * All available renderers.
     */
    renderers?: any[];
    /**
     * All available field renderers.
     */
    fields?: any[];
    // allow additional state
    [additionalState: string]: any;
  };
}
