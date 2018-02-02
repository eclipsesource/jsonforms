import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as JsonRefs from 'json-refs';
import { Provider } from 'react-redux';
import {
  Actions,
  DispatchRenderer,
  Generate,
  getData,
  getSchema,
  getUiSchema,
  JsonFormsState,
  JsonFormsStore
} from '@jsonforms/core';
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
        <DispatchRenderer />
      </Provider>,
      this
    );
  }
}
