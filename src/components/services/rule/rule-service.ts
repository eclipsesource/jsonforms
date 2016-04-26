
import {ServiceId} from "../services";
import {IService} from "../services";
import {IPathResolver} from "../pathresolver/jsonforms-pathresolver";

export interface IRuleService extends IService {
    addRuleTrack(ruleServiceCallback:IRuleServiceCallBack): void;
    reevaluateRules(schemaPath:string): void;
}
export interface IRuleServiceCallBack {
    instance:any;
    rule: IRule;
    hide:boolean;
}

export class RuleService implements IRuleService {
    private map :{[key:string]:IRuleServiceCallBack[]}= {};

    constructor(private pathresolver: IPathResolver) { }

    getId(): ServiceId {
        return ServiceId.RuleService;
    }

    reevaluateRules(schemaPath:string){
        if (!(schemaPath in this.map)){
            return;
        }
        var renderDescriptionArray=this.map[schemaPath];
        for(var i=0;i<renderDescriptionArray.length;i++){
            var renderDescription=renderDescriptionArray[i];
            var conditionValue=null;
            try {
                conditionValue=this.pathresolver.resolveInstance(renderDescription.instance,schemaPath);
            }
            catch(e){
                //intentionally left empty as this catches errors due to resolving
            }
            var valueMatch=((<ILeafCondition>renderDescription.rule.condition).expectedValue===conditionValue);
            var effect=renderDescription.rule.effect;
            //hide
            var hide=false;
            hide=(effect===RuleEffect.HIDE && valueMatch) || (effect===RuleEffect.SHOW && !valueMatch);
            renderDescription.hide=hide;


            //disbale is not supported yet
            //var disabled=false;
            //disabled=(effect==="DISABLE" && valueMatch) || (effect==="ENABLE" && !valueMatch);
            //renderDescription.disabled=disabled;
        }
    };

    addRuleTrack(renderDescription: IRuleServiceCallBack){
        if (renderDescription.rule==undefined)
            return;
        var path=renderDescription.rule.condition['scope'].$ref;
        if (!(path in this.map)){
            this.map[path]=[];
        }
        this.map[path].push(renderDescription);
        this.reevaluateRules(path);
    }
}
