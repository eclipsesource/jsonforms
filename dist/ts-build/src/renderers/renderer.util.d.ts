import { Renderer } from '../core/renderer';
import { RendererTester } from '../core/renderer.service';
export interface JsonFormsRendererConfig {
    selector: string;
    tester: RendererTester;
}
export interface JsonFormsRendererConstructable {
    new (): Renderer;
}
export declare const JsonFormsRenderer: (config: JsonFormsRendererConfig) => (cls: JsonFormsRendererConstructable) => void;
