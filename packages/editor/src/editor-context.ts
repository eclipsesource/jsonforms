import { JsonSchema4 } from '@jsonforms/core';
import { ModelMapping } from './helpers/container.util';

// TODO remove when it is no longer needed by the schema service impl: Besides that it is obsolete
export interface EditorContext {
    dataSchema: JsonSchema4;
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
