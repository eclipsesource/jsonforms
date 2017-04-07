import { UISchemaElement } from '../../models/uischema';
import { Renderer } from '../../core/renderer';
import { RUNTIME_TYPE } from '../../core/runtime';
export declare const VerticalLayoutRendererTester: (uischema: UISchemaElement) => 1 | -1;
export declare class VerticalLayoutRenderer extends Renderer {
    private evaluateRuntimeNotification;
    constructor();
    render(): HTMLElement;
    dispose(): void;
    notify(type: RUNTIME_TYPE): void;
}
