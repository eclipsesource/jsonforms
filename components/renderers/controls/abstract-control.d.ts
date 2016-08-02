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
    constructor(scope: ng.IScope);
    protected id: string;
    protected showLabel: boolean;
    protected label: string;
    protected triggerChangeEvent(): void;
    private validate();
    private isRequired(schemaPath);
}
declare var _default: string;
export default _default;
