///<reference path="../references.ts"/>

declare module JSONForms{
    export interface IService {
        getId(): ServiceId
    }
    export interface ISchemaProvider extends IService {
        getSchema(): SchemaElement
    }
    export interface IValidationService extends IService {
        getResult(instance: any, dataPath: string): any
        validate(instance: any, schema: SchemaElement): void
    }
}
