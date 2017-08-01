import * as JsonRefs from 'json-refs';
import * as _ from 'lodash';
import { UISchemaElement } from './models/uischema';
import { JsonForms, JsonFormService } from './core';
import { JsonSchema } from './models/jsonSchema';
import { generateJsonSchema } from './generators/schema-gen';
import { DataChangeListener, DataService } from './core/data.service';

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

/**
 * HTML element that represents the entry point
 */
@CustomElement({
  selector: 'json-forms'
})
export class JsonFormsElement extends HTMLElement {

  private dataService: DataService;
  private uischema: UISchemaElement;
  private dataschema: JsonSchema;
  private dataObject: any;
  private schemaPromise: Promise<any> = null;
  private allowDynamicUpdate = false;
  private services: JsonFormService[] = [];

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
   * Called when this element is removed from a document.
   */
  disconnectedCallback = (): void => {
    this.services.forEach(service => {
      service.dispose();
    });
  }

  /**
   * Set the data to be rendered.
   * @param {Object} data the data to be rendered
   */
  set data(data: Object) {
    this.dataObject = data;
    this.dataService = new DataService(data);
    this.render();
  }

  /**
   * Set the UI schema.
   * @param {UISchemaElement} uischema the UI schema element to be set
   */
  set uiSchema(uischema: UISchemaElement) {
    this.uischema = uischema;
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

  /**
   * Add a data change listener.
   *
   * @param {DataChangeListener} listener the listener to be added
   */
  addDataChangeListener = (listener: DataChangeListener): void => {
    this.dataService.registerDataChangeListener(listener);
  }

  private render(): void {
    if (!this.allowDynamicUpdate) {
      return;
    }
    if (this.schemaPromise !== null) {
      return;
    }
    if (this.dataObject == null || this.dataService == null) {
      return;
    }

    if (this.lastChild !== null) {
      this.removeChild(this.lastChild);
    }

    this.services.forEach(service => {
      service.dispose();
    });
    this.services = [];
    const schema = this.dataSchema;
    this.instantiateSchemaIfNeeded(schema);
    const uiSchema = this.uiSchema;
    this.createServices(uiSchema, schema);

    const bestRenderer = JsonForms.rendererService
        .findMostApplicableRenderer(uiSchema, schema, this.dataService);
    this.appendChild(bestRenderer);

    this.dataService.initDataChangeListeners();
  }

  private createServices(uiSchema, dataSchema): void {
    JsonForms.jsonFormsServices.forEach(service =>
        this.services.push(new service(this.dataService, dataSchema, uiSchema))
    );
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
