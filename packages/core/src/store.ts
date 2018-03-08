/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
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
     * Global configuration options.
     */
    config?: any;
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
