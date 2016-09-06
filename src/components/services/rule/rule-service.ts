import {ServiceId} from '../services';
import {IService} from '../services';
import {IRule, ILeafCondition, RuleEffect} from '../../../uischema';
import {PathResolver} from '../path-resolver/path-resolver';

export interface IRuleService extends IService {
    addRuleTrack(ruleServiceCallback: IRuleServiceCallBack): void;
    reevaluateRules(schemaPath: string): void;
}
export interface IRuleServiceCallBack {
    instance: any;
    rule: IRule;
    hide: boolean;
}

export class RuleService implements IRuleService {
    private map: { [key: string]: IRuleServiceCallBack[] } = {};

    getId(): ServiceId {
        return ServiceId.RuleService;
    }

    reevaluateRules(schemaPath: string) {
        if (!(schemaPath in this.map)) {
            return;
        }
        let renderDescriptionArray = this.map[schemaPath];
        for (let i = 0; i < renderDescriptionArray.length; i++) {
            let renderDescription = renderDescriptionArray[i];
            let conditionValue = null;
            try {
                conditionValue = PathResolver.resolveInstance(
                    renderDescription.instance,
                    schemaPath);
            } catch (e) {
                // intentionally left empty as this catches errors due to resolving
            }
            let valueMatch = ((<ILeafCondition>
                renderDescription.rule.condition).expectedValue === conditionValue);
            let effect = renderDescription.rule.effect;
            // hide
            renderDescription.hide = (effect === RuleEffect.HIDE && valueMatch)
                || (effect === RuleEffect.SHOW && !valueMatch);

            // disable is not supported yet
            // var disabled=false;
            // disabled=(effect==="DISABLE" && valueMatch) || (effect==="ENABLE" && !valueMatch);
            // renderDescription.disabled=disabled;
        }
    };

    addRuleTrack(renderDescription: IRuleServiceCallBack) {
        if (renderDescription.rule === undefined) {
            return;
        }
        let path = renderDescription.rule.condition['scope'].$ref;
        if (!(path in this.map)) {
            this.map[path] = [];
        }
        this.map[path].push(renderDescription);
        this.reevaluateRules(path);
    }
}
