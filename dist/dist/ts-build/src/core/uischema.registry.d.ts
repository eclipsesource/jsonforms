import { JsonSchema } from '../models/jsonSchema';
import { UISchemaElement } from '../models/uischema';
/**
 * A registry of UI schemas. This registry can be utilized whenever
 * multiple UI schemas are applicable for a given JSON schema in order
 * to resolve ambiguity.
 */
export interface UISchemaRegistry {
    /**
     * Register a UI schema.
     *
     * @param {UISchemaElement} uiSchema the UI schema to be registered
     * @param {UISchemaTester} tester the tester that determines whether
     *        the given UI schema should be used
     */
    register(uiSchema: UISchemaElement, tester: UISchemaTester): void;
    /**
     * Deregister a UI schema.
     *
     * @param {UISchemaElement} uiSchema the UI schema to be unregistered
     * @param {UISchemaTester} tester
     */
    deregister(uiSchema: UISchemaElement, tester: UISchemaTester): void;
    /**
     * Find the UI schema that is most applicable for the given JSON schema
     * and data.
     * @param {JsonSchema} schema the JSON schema for which to find a UI schema
     * @param {any} data the data for which to find a UI schema
     */
    findMostApplicableUISchema(schema: JsonSchema, data: any): UISchemaElement;
}
/**
 * A tester that returns a priority number when a JSON schema and some data,
 * which determines how likely the associated UI schema will be used to
 * render the JSON schema/data. The higher the returned number, the more likely
 * the associated UI schema will be used.
 */
export declare type UISchemaTester = (schema: JsonSchema, data: any) => number;
/**
 * Constant that indicates that a tester is not capable of handling
 * a combination of schema/data.
 * @type {number}
 */
export declare const NOT_APPLICABLE = -1;
/**
 * Implementation of the UI schema registry.
 */
export declare class UISchemaRegistryImpl implements UISchemaRegistry {
    private registry;
    constructor();
    /**
     * @inheritDoc
     */
    register(uischema: UISchemaElement, tester: UISchemaTester): void;
    /**
     * @inheritDoc
     */
    deregister(uischema: UISchemaElement, tester: UISchemaTester): void;
    /**
     * @inheritDoc
     */
    findMostApplicableUISchema(schema: JsonSchema, data: any): UISchemaElement;
}
