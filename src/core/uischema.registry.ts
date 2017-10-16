import * as _ from 'lodash';
import { generateDefaultUISchema } from '../generators/ui-schema-gen';
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
export type UISchemaTester = (schema: JsonSchema, data: any) => number;

/**
 * Associates a UI schema with a tester.
 */
interface UISchemaDefinition {
    uiSchema: UISchemaElement;
    tester: UISchemaTester;
}

/**
 * Constant that indicates that a tester is not capable of handling
 * a combination of schema/data.
 * @type {number}
 */
export const NOT_APPLICABLE = -1;

/**
 * Default UI schema definition that always returns 0 as its priority.
 * @type {UISchemaDefinition}
 */
const NO_UISCHEMA_DEFINITION: UISchemaDefinition = {
    uiSchema: null,
    tester: schema => 0
};

/**
 * Implementation of the UI schema registry.
 */
export class UISchemaRegistryImpl implements UISchemaRegistry {
    private registry: UISchemaDefinition[] = [];
    constructor() {
        this.registry.push(NO_UISCHEMA_DEFINITION);
    }

    /**
     * @inheritDoc
     */
    register(uiSchema: UISchemaElement, tester: UISchemaTester): void {
        this.registry.push({uiSchema, tester});
    }

    /**
     * @inheritDoc
     */
    deregister(uiSchema: UISchemaElement, tester: UISchemaTester): void {
        this.registry = _.filter(this.registry, el =>
            // compare testers via strict equality
            el.tester !== tester || !_.eq(el.uiSchema, uiSchema)
        );
    }

    /**
     * @inheritDoc
     */
    findMostApplicableUISchema(schema: JsonSchema, data: any): UISchemaElement {
        const bestSchema = _.maxBy(this.registry, renderer =>
            renderer.tester(schema, data)
        );
        if (bestSchema === NO_UISCHEMA_DEFINITION) {
            return generateDefaultUISchema(schema);
        }

        return bestSchema.uiSchema;
    }
}
