import { UISchemaElement } from './models/uischema';
import { DataService, JsonFormService, JsonFormsHolder } from './core';
import { JsonSchema } from './models/jsonSchema';
import { generateDefaultUISchema } from './generators/ui-schema-gen';
import { generateJsonSchema } from './generators/schema-gen';

interface CustomElementConfig {
  selector: string;
}
const CustomElement = (config: CustomElementConfig) => (cls) =>
  window.customElements.define(config.selector, cls);

@CustomElement({
  selector: 'json-forms'
})
export class JsonForms extends HTMLElement {

  private dataService: DataService;
  private uischema: UISchemaElement;
  private dataschema: JsonSchema;
  private services: Array<JsonFormService> = [];
  private dataObject: any;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.allowDynamicUpdate = true;
    this.render();
  }

  disconnectedCallback(): void {
    this.services.forEach(service => service.dispose());
  }

  private render(): void {

    if (this.dataObject == null || this.dataService == null) {
      return;
    }

    if (this.lastChild !== null) {
      this.removeChild(this.lastChild);
    }

    if (this.services.length === 0) {
      this.createServices();
      this.dataService.initialRootRun();
    }

    const bestRenderer = JsonFormsHolder.rendererService
        .getBestRenderer(this.uiSchema, this.dataSchema, this.dataService);
    this.appendChild(bestRenderer);
  }

  set data(data: Object) {
    this.dataObject = data;
    this.dataService = new DataService(data);
    this.render();
  }

  set uiSchema(uischema: UISchemaElement) {
    this.uischema = uischema;
    this.render();
  }

  set dataSchema(dataschema: JsonSchema) {
    this.dataschema = dataschema;
    this.services.forEach(service =>
        service.schemaChanged(dataschema)
    );
    this.render();
  }

  get dataSchema() {
    if (this.dataschema) {
      return this.dataschema;
    }
    return generateJsonSchema(this.dataObject);
  }

  get uiSchema() {
    if (this.uischema) {
      return this.uischema;
    }
    return generateDefaultUISchema(this.dataSchema);
  }

  private createServices(): void {
    JsonFormsHolder.jsonFormsServices.forEach(service =>
        this.services.push(new service(this.dataService, this.dataSchema, this.uiSchema))
    );
  }
}
