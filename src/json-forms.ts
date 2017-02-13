import {UISchemaElement, ControlElement} from "./models/uischema";
import {DataService, JsonFormService, JsonFormsHolder} from "./core";
import {JsonSchema} from "./models/jsonSchema";

interface CustomElementConfig {
  selector: string;
}
const CustomElement = (config: CustomElementConfig) => (cls) => {
  // const tpl = document.querySelector(`#${config.selector}`);
  // cls.template = tpl;
  window.customElements.define(config.selector, cls);
};

@CustomElement({
  selector: "json-forms"
})
export class JsonForms extends HTMLElement {
  private dataService: DataService;
  private uischema: UISchemaElement;
  private dataschema: JsonSchema;
  private services: Array<JsonFormService> = [];
  constructor() {
    super();
  }
  connectedCallback(): void {
      this.render();
  }

  disconnectedCallback(): void {
    this.services.forEach(service => service.dispose());
  }
  private render(): void {
    if (this.dataService == null || this.uischema == null || this.dataschema == null) { // TODO uischema and dataschema are only now relevant
      return;
    }
    if (this.lastChild !== null) {
      this.removeChild(this.lastChild);
    }
    if (this.services.length === 0) {
      this.createServices();
      this.dataService.initialRootRun();
    }

    let bestRenderer = JsonFormsHolder.rendererService.getBestRenderer(this.uischema, this.dataschema, this.dataService);
    this.appendChild(bestRenderer);
  }
  set data(data: Object) {
    this.dataService = new DataService(data);
    this.render();
  }
  set uiSchema(uischema: UISchemaElement) {
    this.uischema = uischema;
    this.render();
  }
  set dataSchema(dataschema: JsonSchema) {
    this.dataschema = dataschema;
    this.render();
  }

  private createServices(): void {
    JsonFormsHolder.jsonFormsServices.forEach(service => this.services.push(new service(this.dataService, this.dataschema, this.uischema)));
  }
}
