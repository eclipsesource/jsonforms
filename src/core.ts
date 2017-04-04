import {UISchemaElement} from './models/uischema';
import {JsonSchema} from './models/jsonSchema';
import {UiSchemaRegistry, UiSchemaRegistryImpl} from './core/uischema.registry';
import {DataService} from './core/data.service';
import {RendererService} from './core/renderer.service';

export interface JsonFormService {
  dispose(): void;
}
export interface JsonFormsServiceConstructable {
  new(dataService: DataService, dataSchema: JsonSchema, uiSchema: UISchemaElement): JsonFormService;
}
export const JsonFormsServiceElement = (config) => (cls: JsonFormsServiceConstructable) => {
  JsonFormsHolder.jsonFormsServices.push(cls);
};
export class JsonFormsHolder {
  public static rendererService = new RendererService();
  public static jsonFormsServices: Array<JsonFormsServiceConstructable> = [];
  public static uischemaRegistry: UiSchemaRegistry = new UiSchemaRegistryImpl();
}
