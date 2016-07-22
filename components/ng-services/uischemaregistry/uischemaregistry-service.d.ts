import { IUISchemaElement } from '../../../uischema';
import { IUISchemaGenerator } from '../../generators/generators';
import { SchemaElement } from '../../../jsonschema';
export interface UiSchemaRegistry {
    register(uiSchema: IUISchemaElement, tester: UiSchemaTester): void;
    getBestUiSchema(schema: SchemaElement, data: any): IUISchemaElement;
}
export interface UiSchemaTester {
    (schema: SchemaElement, data: any): number;
}
export declare const NOT_FITTING: number;
export declare class UiSchemaRegistryImpl implements UiSchemaRegistry {
    private uiSchemaGenerator;
    static $inject: string[];
    private registry;
    constructor(uiSchemaGenerator: IUISchemaGenerator);
    register(uiSchema: IUISchemaElement, tester: UiSchemaTester): void;
    getBestUiSchema(schema: SchemaElement, data: any): IUISchemaElement;
}
declare var _default: string;
export default _default;
