import { IRuleServiceCallBack } from '../../services/rule/rule-service';
import { ILayout, IRule } from '../../../uischema';
export declare abstract class AbstractLayout implements IRuleServiceCallBack {
    protected scope: ng.IScope;
    protected uiSchema: ILayout;
    instance: any;
    rule: IRule;
    hide: boolean;
    constructor(scope: ng.IScope);
}
