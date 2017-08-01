import { UISchemaElement } from './models/uischema';
import { JsonSchema } from './models/jsonSchema';
import { UISchemaRegistry, UISchemaRegistryImpl } from './core/uischema.registry';
import { DataService } from './core/data.service';
import { RendererService } from './core/renderer.service';
import { StylingRegistry, StylingRegistryImpl } from './core/styling.registry';
import { SchemaService } from './core/schema.service';
import { SchemaServiceImpl } from './core/schema.service.impl';

/**
 * Represents a JSONForms service.
 */
export interface JsonFormService {

  /**
   * Disposes this service.
   */
  dispose(): void;
}

/**
 * Encapsulates instantiation logic of a JSONForms service.
 */
export interface JsonFormsServiceConstructable {
  /**
   * Constructor logic.
   *
   * @param {DataService} dataService the data service
   * @param {JsonSchema} dataSchema the JSON schema describing the data
   * @param {UISchemaElement} uiSchema the UI schema to be rendered
   */
  new(dataService: DataService, dataSchema: JsonSchema, uiSchema: UISchemaElement): JsonFormService;
}

/**
 * Global JSONForms object that holds services and registries.
 */
export class JsonForms {
  private static _schemaService;
  public static rendererService = new RendererService();
  public static jsonFormsServices: JsonFormsServiceConstructable[] = [];
  public static uischemaRegistry: UISchemaRegistry = new UISchemaRegistryImpl();
  public static stylingRegistry: StylingRegistry = new StylingRegistryImpl();
  public static set schema(schema: JsonSchema) {
    JsonForms._schemaService = new SchemaServiceImpl(schema);
  }
  public static get schemaService(): SchemaService  {
    if (this._schemaService === undefined) {
      console.error('Schema service has not been initialized');
    }

    return this._schemaService;
  }
}

/**
 * Annotation for registering a class as JSONForms service.
 * @param config
 * @constructor
 */
// Disable rule because it is used as an decorator
// tslint:disable:variable-name
export const JsonFormsServiceElement = config => (cls: JsonFormsServiceConstructable) => {
  JsonForms.jsonFormsServices.push(cls);
};
// tslint:enable:variable-name
