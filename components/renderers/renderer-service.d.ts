import { IUISchemaElement } from '../../uischema';
import { SchemaElement } from '../../jsonschema';
export interface RendererService {
    register(directiveName: string, tester: (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean, spec: number): void;
    getBestComponent(uiSchemaElement: IUISchemaElement, dataSchema: any, dataObject: any): string;
}
export declare const NOT_FITTING: number;
declare var _default: string;
export default _default;
