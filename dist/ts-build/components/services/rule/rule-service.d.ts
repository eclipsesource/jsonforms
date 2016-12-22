import { ServiceId } from '../services';
import { IService } from '../services';
import { IRule } from '../../../uischema';
export interface IRuleService extends IService {
    addRuleTrack(ruleServiceCallback: IRuleServiceCallBack): void;
    reevaluateRules(schemaPath: string): void;
}
export interface IRuleServiceCallBack {
    instance: any;
    rule: IRule;
    hide: boolean;
}
export declare class RuleService implements IRuleService {
    private map;
    getId(): ServiceId;
    reevaluateRules(schemaPath: string): void;
    addRuleTrack(renderDescription: IRuleServiceCallBack): void;
}
