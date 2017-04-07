import { UISchemaElement } from '../models/uischema';
import { JsonSchema } from '../models/jsonSchema';
export interface UiSchemaRegistry {
    register(uiSchema: UISchemaElement, tester: UiSchemaTester): void;
    unregister(uiSchema: UISchemaElement, tester: UiSchemaTester): void;
    getBestUiSchema(schema: JsonSchema, data: any): UISchemaElement;
}
export interface UiSchemaTester {
    (schema: JsonSchema, data: any): number;
}
export declare const NOT_FITTING: number;
export declare class UiSchemaRegistryImpl implements UiSchemaRegistry {
    private registry;
    constructor();
    register(uiSchema: UISchemaElement, tester: UiSchemaTester): void;
    unregister(uiSchema: UISchemaElement, tester: UiSchemaTester): void;
    getBestUiSchema(schema: JsonSchema, data: any): UISchemaElement;
}
