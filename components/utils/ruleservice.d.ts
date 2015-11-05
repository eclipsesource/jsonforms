///<reference path="../references.ts"/>

declare module JSONForms {
    export interface IRuleService extends IService {
        addRuleTrack(renderDescription:IRenderDescription): void;
        revaluateRules(renderDescription:IControlRenderDescription, schemaPath:string): void;
    }
}
