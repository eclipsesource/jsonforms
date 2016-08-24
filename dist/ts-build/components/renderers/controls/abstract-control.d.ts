import { IRuleServiceCallBack } from '../../services/rule/rule-service';
import { IRule, IControlObject } from '../../../uischema';
import { SchemaElement } from '../../../jsonschema';
export declare class AbstractControl implements IRuleServiceCallBack {
    protected scope: ng.IScope;
    instance: any;
    rule: IRule;
    hide: boolean;
    protected schemaPath: string;
    protected resolvedData: any;
    protected resolvedSchema: SchemaElement;
    protected fragment: string;
    protected uiSchema: IControlObject;
    protected schema: SchemaElement;
    protected data: any;
    private services;
    private alerts;
    private showLabel;
    protected label: string;
    constructor(scope: ng.IScope);
    protected id: string;
    private static createLabel(uischema, schemaPath, isRequiredProperty);
    protected triggerChangeEvent(): void;
    private validate();
    private static isRequired(schema, schemaPath);
}
declare var _default: string;
export default _default;
