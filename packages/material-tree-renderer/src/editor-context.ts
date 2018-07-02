import { JsonSchema7 } from '@jsonforms/core';
import { ModelMapping } from './helpers/container.util';

// TODO remove when it is no longer needed by the schema service impl: Besides that it is obsolete
/**
 * @deprecated
 */
export interface EditorContext {
    dataSchema: JsonSchema7;
    identifyingProperty: string;
    modelMapping: ModelMapping;
}
/**
 * @deprecated
 */
export interface StringMap {
    [property: string]: string;
}
/**
 * @deprecated
 */
export interface ModelMapping {
    attribute: string;
    mapping: StringMap;
}
