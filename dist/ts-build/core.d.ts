import { UISchemaElement } from './models/uischema';
import { JsonSchema } from './models/jsonSchema';
import { UiSchemaRegistry } from './core/uischema.registry';
import { DataService } from './core/data.service';
import { RendererService } from './core/renderer.service';
export interface JsonFormService {
    dispose(): void;
}
export interface JsonFormsServiceConstructable {
    new (dataService: DataService, dataSchema: JsonSchema, uiSchema: UISchemaElement): JsonFormService;
}
export declare const JsonFormsServiceElement: (config: any) => (cls: JsonFormsServiceConstructable) => void;
export declare class JsonFormsHolder {
    static rendererService: RendererService;
    static jsonFormsServices: Array<JsonFormsServiceConstructable>;
    static uischemaRegistry: UiSchemaRegistry;
}
