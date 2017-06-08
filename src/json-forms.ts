import { UISchemaElement } from './models/uischema';
import { JsonFormService, JsonFormsHolder } from './core';
import { JsonSchema } from './models/jsonSchema';
import { generateJsonSchema } from './generators/schema-gen';
import * as JsonRefs from 'json-refs';
import {DataService, DataChangeListener} from './core/data.service';
import {SchemaExtractor} from './parser/schema_extractor';
import {FullDataModelType, ItemModel, isItemModel} from './parser/item_model';
interface CustomElementConfig {
  selector: string;
}
const CustomElement = (config: CustomElementConfig) => (cls) =>
    customElements.define(config.selector, cls);

@CustomElement({
  selector: 'json-forms'
})
export class JsonForms extends HTMLElement {
  private dataService: DataService;
  private uischema: UISchemaElement;
  private _dataModel: FullDataModelType;
  private dataObject: any;
  private schemaPromise: Promise<FullDataModelType> = null;
  private allowDynamicUpdate = false;
  private services: Array<JsonFormService> = [];
  private generatedSchema = false;
  private dataObjectChangedAfterSchemGeneration = false;

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

  set data(data: Object) {
    this.dataObject = data;
    this.dataService = new DataService(data);
    this.dataObjectChangedAfterSchemGeneration = true;
    this.render();
  }

  set uiSchema(uischema: UISchemaElement) {
    this.uischema = uischema;
    this.render();
  }

  set dataSchema(dataschema: JsonSchema) {
    this.schemaPromise = new SchemaExtractor(dataschema).extract();
    this.schemaPromise.then(result => {
      this._dataModel = result;
      this.schemaPromise = null;
      this.render();
    });
    this.generatedSchema = false;
  }
  set dataModel(datamodel: FullDataModelType) {
    this._dataModel = datamodel;
    this.generatedSchema = false;
  }
  get dataModel() {
    return this._dataModel;
  }

  get uiSchema() {
    if (this.uischema) {
      return this.uischema;
    }
    return JsonFormsHolder.uischemaRegistry.getBestUiSchema(
      isItemModel(this.dataModel) ? this.dataModel.schema : {}, this.dataObject);
  }

  addDataChangeListener(listener: DataChangeListener): void {
    this.dataService.registerChangeListener(listener);
  }

  private render(): void {
    if (!this.allowDynamicUpdate) {
      return;
    }
    if (this.dataObject == null || this.dataService == null) {
      return;
    }
    if (this.schemaPromise !== null) {
      return;
    }
    if (this._dataModel === undefined ||
        this.generatedSchema && this.dataObjectChangedAfterSchemGeneration) {
      this.dataSchema = generateJsonSchema(this.dataObject);
      this.dataObjectChangedAfterSchemGeneration = false;
      this.generatedSchema = true;
      return;
    }

    if (this.lastChild !== null) {
      this.removeChild(this.lastChild);
    }

    this.services.forEach(service => service.dispose());
    this.services = [];
    const model = this.dataModel;
    const uiSchema = this.uiSchema;
    this.createServices(uiSchema, model);

    const bestRenderer = JsonFormsHolder.rendererService
        .getBestRenderer(uiSchema, model, this.dataService);
    this.appendChild(bestRenderer);

    this.dataService.initialRootRun();
  }

  private createServices(uiSchema: UISchemaElement, model): void {
    JsonFormsHolder.jsonFormsServices.forEach(service =>
        this.services.push(new service(this.dataService, model, uiSchema))
    );
  }
}
