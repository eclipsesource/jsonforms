/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
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
import { Store } from './util';
import { JsonFormsCore } from './reducers/core';
import { JsonFormsCellRendererRegistryEntry } from './reducers/cells';
import { JsonFormsRendererRegistryEntry } from './reducers/renderers';
import { JsonFormsLocaleState } from './reducers/i18n';
import { JsonFormsUISchemaRegistryEntry } from './reducers/uischemas';

/**
 * JSONForms store.
 */
export interface JsonFormsStore extends Store<JsonFormsState> {}

/**
 * The state shape of JSONForms.
 */
export interface JsonFormsState {
  /**
   * Represents JSONForm's sub-state.
   */
  jsonforms: JsonFormsSubStates;
}

export interface JsonFormsSubStates {
  /**
   * Substate for storing mandatory sub-state.
   */
  core?: JsonFormsCore;
  /**
   * Global configuration options.
   */
  config?: any;
  /**
   * All available renderers.
   */
  renderers?: JsonFormsRendererRegistryEntry[];
  /**
   * All available cell renderers.
   */
  cells?: JsonFormsCellRendererRegistryEntry[];
  /**
   *
   */
  i18n?: JsonFormsLocaleState;
  /**
   *
   */
  uischemas?: JsonFormsUISchemaRegistryEntry[];
  /**
   * If true, sets all controls to read-only.
   */
  readonly?: boolean;
  // allow additional state
  [additionalState: string]: any;
}

export interface JsonFormsExtendedState<T> extends JsonFormsState {
  jsonforms: {
    [subState: string]: T;
  };
}
