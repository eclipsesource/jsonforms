///<reference path="../../references.ts"/>

declare module JSONForms {
    export interface IPathResolver {
        toInstancePath(schemaPath:string): string

        resolveUi(instance:any, uiPath:string): any

        resolveInstance(instance:any, path:string): any

        resolveSchema(schema: SchemaElement, schemaPath: string): SchemaElement
    }
}
