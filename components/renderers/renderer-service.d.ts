import { IPathResolver } from '../services/pathresolver/jsonforms-pathresolver';
import { IUISchemaElement } from '../../uischema';
export interface RendererService {
    register(directiveName: string, tester: RendererTester): void;
    getBestComponent(uiSchemaElement: IUISchemaElement, dataSchema: any, dataObject: any): string;
}
export interface RendererTester {
    (element: IUISchemaElement, dataSchema: any, dataObject: any, pathResolver: IPathResolver): number;
}
export declare const NOT_FITTING: number;
declare var _default: string;
export default _default;
