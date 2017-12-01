import * as React from 'react';
import * as JsonRefs from 'json-refs';
import * as _ from 'lodash';
import './renderers';
import { UISchemaElement } from './models/uischema';
import { JsonForms } from './core';
import { JsonSchema } from './models/jsonSchema';
import { generateJsonSchema } from './generators/schema-gen';
import { Store } from 'redux';
import { initJsonFormsStore } from './store';
import DispatchRenderer from './renderers/dispatch-renderer';
import { Provider, render } from './common/binding';

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

  /**
   * Returns the UI schema to be rendered.
   *
   * @returns {UISchemaElement} the UI schema to be rendered
   */
  get uiSchema(): UISchemaElement {
    if (!_.isEmpty(this.uischema)) {
      return this.uischema;
    }

    return JsonForms.uischemaRegistry.findMostApplicableUISchema(this.dataSchema, this.dataObject);
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

  /**
   * Returns the JSON schema that describes the data to be rendered.
   *
   * @returns {JsonSchema} the JSON schema that describes the data to be rendered
   */
  get dataSchema(): JsonSchema {
    if (!_.isEmpty(this.dataschema)) {
      return this.dataschema;
    }

    return generateJsonSchema(this.dataObject);
  }

  private render(): void {
    if (!this.allowDynamicUpdate) {
      return;
    }
    if (this.schemaPromise !== null) {
      return;
    }

    if (_.isEmpty(this.dataObject)) {
      return;
    }

    const schema = this.dataSchema;
    this.instantiateSchemaIfNeeded(schema);
    const uischema = this.uiSchema;

    this.store = initJsonFormsStore(this.dataObject, schema, uischema);
    const storeId = new Date().toISOString();

    render(
      <Provider store={this.store} key={`${storeId}-store`}>
        <DispatchRenderer uischema={uischema} schema={schema} />
      </Provider>,
      this
    );

    this.className = JsonForms.stylingRegistry.getAsClassName('json-forms');
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
