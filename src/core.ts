import {UISchemaElement} from './models/uischema';
import {JsonSchema} from './models/jsonSchema';
import {UiSchemaRegistry, UiSchemaRegistryImpl} from './core/uischema.registry';
import {DataService} from './core/data.service';
import {RendererService} from './core/renderer.service';
import {StylingRegistry, StylingRegistryImpl} from './core/styling.registry';

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
 * Annotation for registering a class as JSONForms service.
 * @param config
 * @constructor
 */
export const JsonFormsServiceElement = (config) => (cls: JsonFormsServiceConstructable) => {
  JsonFormsHolder.jsonFormsServices.push(cls);
};

/**
 * Global JSONForms object that holds services and registries.
 */
export class JsonFormsHolder {
  public static rendererService = new RendererService();
  public static jsonFormsServices: Array<JsonFormsServiceConstructable> = [];
  public static uischemaRegistry: UiSchemaRegistry = new UiSchemaRegistryImpl();
  public static stylingRegistry: StylingRegistry = new StylingRegistryImpl();
}
