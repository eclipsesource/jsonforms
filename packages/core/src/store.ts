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
import { JsonFormsCore } from './reducers/core';
import { JsonFormsFieldRendererRegistryEntry } from './reducers/fields';
import { JsonFormsRendererRegistryEntry } from './reducers/renderers';
import { JsonFormsLocaleState } from './reducers/i18n';

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
   * All available field renderers.
   */
  fields?: JsonFormsFieldRendererRegistryEntry[];
  /**
   *
   */
  i18n?: JsonFormsLocaleState;
  // allow additional state
  [additionalState: string]: any;
}

export interface JsonFormsExtendedState<T> extends JsonFormsState {
  jsonforms: {
    [subState: string]: T;
  };
}
