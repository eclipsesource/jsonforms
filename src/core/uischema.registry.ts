import * as _ from 'lodash';
import {UISchemaElement} from '../models/uischema';
import {JsonSchema} from '../models/jsonSchema';
import {generateDefaultUISchema} from '../generators/ui-schema-gen';

/**
 * A registry of UI schemas. This registry can be utilized whenever
 * multiple UI schemas are applicable for a given JSON schema in order
 * to resolve ambiguity.
 */
export interface UiSchemaRegistry {
    /**
     * Register a UI schema.
     *
     * @param {UISchemaElement} uiSchema the UI schema to be registered
     * @param {UiSchemaTester} tester the tester that determines whether
     *        the given UI schema should be used
     */
    register(uiSchema: UISchemaElement, tester: UiSchemaTester): void;

    /**
     * Unregister a UI schema.
     *
     * @param {UISchemaElement} uiSchema the UI schema to be unregistered
     * @param {UiSchemaTester} tester
     */
    unregister(uiSchema: UISchemaElement, tester: UiSchemaTester): void;

    /**
     * Find the UI schema that is most applicable for the given JSON schema
     * and data.
     * @param {JsonSchema} schema the JSON schema for which to find a UI schema
     * @param {any} data the data for which to find a UI schema
     */
    getBestUiSchema(schema: JsonSchema, data: any): UISchemaElement;
}

/**
 * A tester that returns a priority number when a JSON schema and some data,
 * which determines how likely the associated UI schema will be used to
 * render the JSON schema/data. The higher the returned number, the more likely
 * the associated UI schema will be used.
 */
export interface UiSchemaTester {
    /**
     * The apply method of this tester.
     *
     * @param {JsonSchema} schema the JSON schema to test
     * @param {any} data the data to test
     */
    (schema: JsonSchema, data: any): number;
}

/**
 * Associates a UI schema with a tester.
 */
interface UiSchemaDefinition {
    uiSchema: UISchemaElement;
    tester: UiSchemaTester;
}

/**
 * Constant that indicates that a tester is not capable of handling
 * a combination of schema/data.
 * @type {number}
 */
export const NOT_FITTING: number = -1;

/**
 * Default UI schema definition that always returns 0 as its priority.
 * @type {UiSchemaDefinition}
 */
const NO_UISCHEMA_DEFINITION = {uiSchema: null, tester: (schema) => 0} as UiSchemaDefinition;

/**
 * Implementation of the UI schema registry.
 */
export class UiSchemaRegistryImpl implements UiSchemaRegistry {
    private registry: Array<UiSchemaDefinition> = [];
    constructor() {
        this.registry.push(NO_UISCHEMA_DEFINITION);
    }

    /**
     * @inheritDoc
     */
    register(uiSchema: UISchemaElement, tester: UiSchemaTester): void {
        this.registry.push({uiSchema, tester});
    }

    /**
     * @inheritDoc
     */
    unregister(uiSchema: UISchemaElement, tester: UiSchemaTester): void {
        this.registry = _.filter(this.registry, el =>
            // compare testers via strict equality
            el.tester !== tester || !_.eq(el.uiSchema, uiSchema)
        );
    }

    /**
     * @inheritDoc
     */
    getBestUiSchema(schema: JsonSchema, data: any): UISchemaElement {
        const bestSchema = _.maxBy(this.registry, renderer =>
            renderer.tester(schema, data)
        );
        if (bestSchema === NO_UISCHEMA_DEFINITION) {
            return generateDefaultUISchema(schema);
        }
        return bestSchema.uiSchema;
    }
}
