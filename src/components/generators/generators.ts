export interface ISchemaGenerator {
    generateDefaultSchema(instance:Object): Object
    generateDefaultSchemaWithOptions(instance:Object,
                                     allowAdditionalProperties:(properties:Object) => boolean,
                                     requiredProperties:(properties:string[]) => string[]) : Object
}

export interface IUISchemaGenerator {
    generateDefaultUISchema(jsonSchema:any): any
}


export default angular.module('jsonforms.generators', []).name;
