import { UISchemaElement } from '../models/uischema';
import { JsonSchema } from '../models/jsonSchema';
import { DataService } from './data.service';
export interface RendererTester {
    (element: UISchemaElement, schema: JsonSchema): number;
}
export declare class RendererService {
    private renderers;
    registerRenderer(tester: RendererTester, renderer: string): void;
    unregisterRenderer(tester: RendererTester, renderer: string): void;
    getBestRenderer(uischema: UISchemaElement, schema: JsonSchema, dataService: DataService): HTMLElement;
}
