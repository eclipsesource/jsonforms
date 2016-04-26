///<reference path="../../references.ts"/>

declare module JSONForms {
    export interface IRuleService extends IService {
        addRuleTrack(renderDescription:IRenderDescription): void;
        reevaluateRules(schemaPath:string): void;
    }
}
