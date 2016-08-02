import { IUISchemaGenerator } from './generators';
import { IUISchemaElement } from '../../uischema';
export declare class UISchemaGenerator implements IUISchemaGenerator {
    private static createLayout(layoutType);
    private static isIgnoredProperty(propertyKey, propertyValue);
    private static deriveType(jsonSchema);
    private static getControlObject(label, ref);
    private static wrapInLayoutIfNecessary(uiSchema, layoutType);
    generateDefaultUISchema(jsonSchema: any, layoutType?: string): IUISchemaElement;
    private generateUISchema(jsonSchema, schemaElements, currentRef, schemaName, layoutType);
    private addLabel;
}
declare var _default: string;
export default _default;
