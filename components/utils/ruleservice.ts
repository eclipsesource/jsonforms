///<reference path="../references.ts"/>

module JSONForms {
    export class RuleService implements IRuleService {
        private map = {};
        static $inject = ['PathResolver'];

        constructor(private pathresolver:JSONForms.IPathResolver) { }

        getId(): ServiceId {
            return ServiceId.RuleService;
        }

        revaluateRules(changedRenderDescription:JSONForms.IControlRenderDescription, schemaPath:string){
            if (!(schemaPath in this.map)){
                return;
            }
            var renderDescriptionArray=this.map[schemaPath];
            for(var i=0;i<renderDescriptionArray.length;i++){
                var renderDescription=renderDescriptionArray[i];
                var conditionValue=this.pathresolver.resolveInstance(renderDescription.instance,schemaPath);

                var hide=false;
                var disabled=false;
                var valueMatch=(renderDescription.rule.condition.value===conditionValue);
                var effect=renderDescription.rule.effect;
                hide=(effect==="HIDE" && valueMatch) || (effect==="SHOW" && !valueMatch);
                disabled=(effect==="DISABLE" && valueMatch) || (effect==="ENABLE" && !valueMatch);

                renderDescription.hide=hide;
                renderDescription.disabled=disabled;
            }
        };

        addRuleTrack(renderDescription:JSONForms.IRenderDescription){
            if (renderDescription.rule==undefined)
                return;
            var path=renderDescription.rule.condition['scope'].$ref;
            if (!(path in this.map)){
                this.map[path]=[];
            }
            this.map[path].push(renderDescription);
        }
    }
}
