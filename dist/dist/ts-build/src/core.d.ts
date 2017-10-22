import { UISchemaElement } from './models/uischema';
import { JsonSchema } from './models/jsonSchema';
import { UISchemaRegistry } from './core/uischema.registry';
import { RendererService } from './core/renderer.service';
import { StylingRegistry } from './core/styling.registry';
import { SchemaService } from './core/schema.service';
import { Store } from 'redux';
/**
 * Represents a JSONForms service.
 */
export interface JsonFormService {
    /**
     * Disposes this service.
     */
    dispose(): void;
}
export declare class JsonFormsConfig {
    private _identifyingProp;
    setIdentifyingProp(propName: string): void;
    getIdentifyingProp(): any;
    shouldGenerateIdentifier(): boolean;
}
/**
 * Encapsulates instantiation logic of a JSONForms service.
 */
export interface JsonFormsServiceConstructable {
    /**
     * Constructor logic.
     *
     * @param {store}
     * @param {JsonSchema} dataSchema the JSON schema describing the data
     * @param {UISchemaElement} uiSchema the UI schema to be rendered
     */
    new (store: Store<any>, dataSchema: JsonSchema, uiSchema: UISchemaElement): JsonFormService;
}
/**
 * Global JSONForms object that holds services and registries.
 */
export declare class JsonForms {
    private static _config;
    private static _schemaService;
    static rendererService: RendererService;
    static jsonFormsServices: JsonFormsServiceConstructable[];
    static uischemaRegistry: UISchemaRegistry;
    static stylingRegistry: StylingRegistry;
    static modelMapping: any;
    static schema: JsonSchema;
    static readonly schemaService: SchemaService;
    static readonly config: JsonFormsConfig;
    /**
     * Uses the model mapping to filter all objects that are associated with the type
     * defined by the given schema id. If there is no applicable mapping,
     * we assume that no mapping is necessary and do not filter out affected data objects.
     *
     * @param objects the list of data objects to filter
     * @param schemaId The id of the JsonSchema defining the type to filter for
     * @return The filtered data objects or all objects if there is no applicable mapping
     */
    static filterObjectsByType: (objects: Object[], schemaId: string) => Object[];
    /**
     * Uses the model mapping to find the schema id defining the type of the given object.
     * If no schema id can be determined either because the object is empty, there is no model
     * mapping, or the object does not contain a mappable property.
     * TODO expected behavior?
     *
     * @param object The object whose type is determined
     * @return The schema id of the object or null if it could not be determined
     */
    static getSchemaIdForObject: (object: Object) => string;
}
/**
 * Annotation for registering a class as JSONForms service.
 * @param config
 * @constructor
 */
export declare const JsonFormsServiceElement: (config: any) => (cls: JsonFormsServiceConstructable) => void;
