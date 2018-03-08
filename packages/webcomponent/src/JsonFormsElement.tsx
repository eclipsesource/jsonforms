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
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as JsonRefs from 'json-refs';
import { Provider } from 'react-redux';
import {
  Actions,
  Generate,
  getData,
  getSchema,
  getUiSchema,
  JsonFormsState,
  JsonFormsStore
} from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import { Store } from 'redux';

/**
 * Configuration element that associated a custom element with a selector string.
 */
interface CustomElementConfig {
  selector: string;
}

/**
 * Annotation that registered the given config and class as a custom element
 * @param {CustomElementConfig} config the configuration object for the custom element
 * @constructor
 */
// Usage as decorator
// tslint:disable:variable-name
const CustomElement = (config: CustomElementConfig) => cls => {
// tslint:enable:variable-name
  if (customElements.get(config.selector)) {
    return;
  }
  customElements.define(config.selector, cls);
};

// TODO: Type parameter

/**
 * HTML element that represents the entry point
 */
@CustomElement({
  selector: 'json-forms'
})
export class JsonFormsElement extends HTMLElement {

  private allowDynamicUpdate = false;
  private _store: JsonFormsStore;

  /**
   * Constructor.
   */
  constructor() {
    super();
  }

  /**
   * Called when this element is inserted into a document.
   */
  connectedCallback(): void {
    this.allowDynamicUpdate = true;
    this.render();
  }

  /**
   * Set the store to be used by the element
   *
   * @package
   * @param {Object} store the store containing the jsonforms state and reducer
   */
  set store(store: Store<JsonFormsState>) {
    const setupStore = (schema, uischema, d) => {
      store.dispatch(Actions.init(d, schema, uischema));

      return store;
    };

    const data = getData(store.getState()) || {};

    JsonRefs
      .resolveRefs(
        getSchema(store.getState()) || Generate.jsonSchema(data),
        { includeInvalid: true }
      ).then(result => {
        this._store = setupStore(
          result.resolved,
          getUiSchema(store.getState()),
          data
        );
        this.render();
      });
  }

  get store() {
    return this._store;
  }

  private render(): void {
    if (!this.allowDynamicUpdate) {
      return;
    }
    if (this._store === null || this._store === undefined) {
      return;
    }

    const storeId = new Date().toISOString();

    ReactDOM.render(
      <Provider store={this._store} key={`${storeId}-store`}>
        <JsonForms />
      </Provider>,
      this
    );
  }
}
