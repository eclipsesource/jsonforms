import { IUISchemaElement } from '../../../uischema';
import { IUISchemaGenerator } from '../../generators/generators';
export interface UiSchemaRegistry {
    register(uiSchema: IUISchemaElement, tester: UiSchemaTester): void;
    getBestUiSchema(dataSchema: any): IUISchemaElement;
}
export interface UiSchemaTester {
    (dataSchema: any): number;
}
export declare const NOT_FITTING: number;
export declare class UiSchemaRegistryImpl implements UiSchemaRegistry {
    private uiSchemaGenerator;
    static $inject: string[];
    private registry;
    constructor(uiSchemaGenerator: IUISchemaGenerator);
    register(uiSchema: IUISchemaElement, tester: UiSchemaTester): void;
    getBestUiSchema(dataSchema: any): IUISchemaElement;
}
declare var _default: string;
export default _default;
