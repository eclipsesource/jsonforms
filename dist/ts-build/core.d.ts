import { UISchemaElement } from './models/uischema';
import { JsonSchema } from './models/jsonSchema';
import { UISchemaRegistry } from './core/uischema.registry';
import { DataService } from './core/data.service';
import { RendererService } from './core/renderer.service';
import { StylingRegistry } from './core/styling.registry';
import { SchemaService } from './core/schema.service';
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
    new (dataService: DataService, dataSchema: JsonSchema, uiSchema: UISchemaElement): JsonFormService;
}
/**
 * Global JSONForms object that holds services and registries.
 */
export declare class JsonForms {
    private static _schemaService;
    static rendererService: RendererService;
    static jsonFormsServices: JsonFormsServiceConstructable[];
    static uischemaRegistry: UISchemaRegistry;
    static stylingRegistry: StylingRegistry;
    static schema: JsonSchema;
    static readonly schemaService: SchemaService;
}
/**
 * Annotation for registering a class as JSONForms service.
 * @param config
 * @constructor
 */
export declare const JsonFormsServiceElement: (config: any) => (cls: JsonFormsServiceConstructable) => void;
