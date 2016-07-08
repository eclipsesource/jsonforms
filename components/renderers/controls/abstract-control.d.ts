import { IPathResolver } from '../../services/pathresolver/jsonforms-pathresolver';
import { RendererTester } from '../renderer-service';
import { IRuleServiceCallBack } from '../../services/rule/rule-service';
import { IRule, IControlObject, IWithLabel, ILabelObject } from '../../../uischema';
import { SchemaElement } from '../../../jsonschema';
export declare abstract class AbstractControl implements IRuleServiceCallBack {
    protected scope: ng.IScope;
    protected pathResolver: IPathResolver;
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
    constructor(scope: ng.IScope, pathResolver: IPathResolver);
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
export declare const ControlRendererTester: (type: string, specificity: number) => RendererTester;
