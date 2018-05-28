import { JsonSchema } from '@jsonforms/core';
import { ModelMapping } from './helpers/containment.util';

// TODO remove when it is no longer needed by the schema service impl: Besides that it is obsolete
export interface EditorContext {
    dataSchema: JsonSchema;
    identifyingProperty: string;
    modelMapping: ModelMapping;
}

export interface StringMap {
    [property: string]: string;
}

export interface ModelMapping {
    attribute: string;
    mapping: StringMap;
}
