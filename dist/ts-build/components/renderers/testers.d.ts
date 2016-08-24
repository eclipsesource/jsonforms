import { SchemaElement } from '../../jsonschema';
import { IUISchemaElement } from '../../uischema';
export declare function schemaTypeIs(expected: string): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean;
export declare function hasDataPropertyValue(propName: string, expected: any): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean;
export declare function uiTypeIs(expected: string): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean;
export declare function optionIs(optionName: string, expected: any): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean;
export declare function schemaTypeMatches(check: (schema: SchemaElement) => boolean): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean;
export declare function schemaPathEndsWith(expected: string): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean;
export declare function schemaPropertyName(expected: string): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean;
export declare function always(uiSchema: IUISchemaElement, schema: SchemaElement, data: any): boolean;
export declare class RendererTesterBuilder {
    and(...testers: Array<(uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean>): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean;
    create(test: (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean, spec: number): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => number;
}
export declare const Testers: RendererTesterBuilder;
declare var _default: string;
export default _default;
