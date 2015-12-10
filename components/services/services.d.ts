///<reference path="../references.ts"/>

declare module JSONForms{
    export interface IService {
        getId(): ServiceId
    }
    export interface IPathResolverService extends IService{
        getResolver(): PathResolver
    }
    export interface IScopeProvider extends IService {
        getScope(): ng.IScope
    }
    export interface IUiSchemaProvider extends IService {
        getUiSchema(): IUISchemaElement
    }
    export interface ISchemaProvider extends IService {
        getSchema(): SchemaElement
    }
    export interface IValidationService extends IService {
        getResult(instance: any, dataPath: string): any
        validate(instance: any, schema: SchemaElement): void
    }
}
