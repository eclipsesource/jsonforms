import { PathResolver } from '../../services/pathresolver/jsonforms-pathresolver';
import { IRuleServiceCallBack } from '../../services/rule/rule-service';
import { IRule, IControlObject, IWithLabel, ILabelObject, IUISchemaElement } from '../../../uischema';
import { SchemaElement } from "../../../jsonschema";
export declare class AbstractControl implements IRuleServiceCallBack {
    protected scope: ng.IScope;
    instance: any;
    rule: IRule;
    hide: boolean;
    protected schemaPath: string;
    protected modelValue: any;
    protected fragment: string;
    protected uiSchema: IControlObject;
    protected schema: SchemaElement;
    protected data: any;
    private services;
    private alerts;
    protected pathResolver: PathResolver;
    constructor(scope: ng.IScope);
    protected id: string;
    protected showLabel: boolean;
    protected label: string;
    protected modelChanged(): void;
    private validate();
    private isRequired(schemaPath);
}
export declare class LabelObjectUtil {
    static shouldShowLabel(label: IWithLabel): boolean;
    static getElementLabelObject(labelProperty: IWithLabel, schemaPath: string): ILabelObject;
}
export declare function schemaTypeIs(expected: string): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean;
export declare function uiTypeIs(expected: string): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean;
export declare function optionIs(optionName: string, expected: any): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean;
export declare function schemaTypeMatches(check: (SchemaElement) => boolean): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean;
export declare function schemaPathEndsWith(expected: string): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean;
export declare class RendererTesterBuilder {
    and(...testers: Array<(uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean>): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean;
    create(test: (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean, spec: number): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => number;
    none(uiSchema: IUISchemaElement, schema: SchemaElement, data: any): number;
}
export declare const Testers: RendererTesterBuilder;
declare var _default: string;
export default _default;
