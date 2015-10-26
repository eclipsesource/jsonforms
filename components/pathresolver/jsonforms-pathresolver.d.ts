///<reference path="../references.ts"/>

declare module JSONForms {
    export interface IPathResolver {
        //addUiPathToSchemaRefMapping(addition:any): void

        //getSchemaRef(uiSchemaPath:string): any

        toInstancePath(path:string): string

        resolveUi(instance:any, uiPath:string): any

        resolveInstance(instance:any, path:string): any

        resolveSchema(schema:SchemaElement, schemaPath:string): SchemaElement
    }
}
