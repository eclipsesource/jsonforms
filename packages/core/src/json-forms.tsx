import * as React from 'react';
import * as JsonRefs from 'json-refs';
import * as _ from 'lodash';
import './renderers';
import { UISchemaElement } from './models/uischema';
import { JsonForms } from './core';
import { JsonSchema } from './models/jsonSchema';
import { Store } from 'redux';
import { initJsonFormsStore } from './store';
import DispatchRenderer from './renderers/dispatch-renderer';
import { Provider, render } from './common/binding';
import { getStyleAsClassName } from './reducers';

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
export interface JsonFormsStore extends Store<any> {
}

/**
 * HTML element that represents the entry point
 */
@CustomElement({
  selector: 'json-forms'
})
export class JsonFormsElement extends HTMLElement {

  private dataObject: any;
  private uischema: UISchemaElement;
  private dataschema: JsonSchema;
  private styleDefs: { name: string, classNames: string[] }[];

  schemaPromise: Promise<any> = null;
  private allowDynamicUpdate = false;
  // TODO: maybe make only dispatch accessible?
  store: Store<any>;

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
   * Set the data to be rendered.
   * @param {Object} data the data to be rendered
   */
  set data(data: Object) {
    this.dataObject = data;

    // TODO
    this.render();
  }

  /**
   * Set the UI schema.
   * @param {UISchemaElement} uischema the UI schema element to be set
   */
  set uiSchema(uischema: UISchemaElement) {
    this.uischema = uischema;
    // TODO
    this.render();
  }

  set styles(styles: { name: string, classNames: string[] }[]) {
    this.styleDefs = styles;
    this.render();
  }

  /**
   * Set the JSON data schema that describes the data to be rendered.
   * @param {JsonSchema} dataSchema the data schema to be rendered
   */
  set dataSchema(dataSchema: JsonSchema) {
    this.schemaPromise = JsonRefs.resolveRefs(dataSchema, {includeInvalid: true});
    this.schemaPromise.then(result => {
      this.dataschema = result.resolved;
      this.schemaPromise = null;
      this.render();
    });
  }

  private render(): void {
    if (!this.allowDynamicUpdate) {
      return;
    }
    if (this.schemaPromise !== null) {
      return;
    }
    if ((this.dataObject === undefined || this.dataObject === null)
      && _.isEmpty(this.dataschema)) {
      return;
    }

    this.store = initJsonFormsStore({
      data: this.dataObject,
      schema: this.dataschema,
      uischema: this.uischema,
      styles: this.styleDefs
    });
    this.instantiateSchemaIfNeeded(this.store.getState().common.schema);
    const storeId = new Date().toISOString();

    render(
      <Provider store={this.store} key={`${storeId}-store`}>
        <DispatchRenderer />
      </Provider>,
      this
    );

    this.className = getStyleAsClassName(this.store.getState())('json-forms');
  }

  private instantiateSchemaIfNeeded(schema: JsonSchema): void {
    let parent = this.parentNode;
    while (parent !== document.body && parent !== null) {
      if (parent.nodeName === 'JSON-FORMS') {
        return;
      }
      parent = parent.parentNode;
    }
    JsonForms.schema = schema;
  }
}
