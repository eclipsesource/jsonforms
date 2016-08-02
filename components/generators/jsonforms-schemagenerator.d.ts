import { ISchemaGenerator } from './generators';
export declare class SchemaGenerator implements ISchemaGenerator {
    protected static requiredProperties(properties: string[]): string[];
    protected static allowAdditionalProperties(properties: Object): boolean;
    generateDefaultSchema(instance: Object): Object;
    generateDefaultSchemaWithOptions(instance: Object, allowAdditionalProperties: (properties: Object) => boolean, requiredProperties: (properties: string[]) => string[]): Object;
    private schemaObject(instance, allowAdditionalProperties, requiredProperties);
    private properties;
    private property(instance, allowAdditionalProperties, requiredProperties);
    private schemaObjectOrNullOrArray(instance, allowAdditionalProperties, requiredProperties);
    private schemaArray(instance, allowAdditionalProperties, requiredProperties);
    private distinct(array, discriminator);
}
declare var _default: string;
export default _default;
