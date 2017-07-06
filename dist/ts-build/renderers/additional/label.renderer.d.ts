import { Renderer } from '../../core/renderer';
import { RankedTester } from '../../core/testers';
import { RUNTIME_TYPE } from '../../core/runtime';
/**
 * Default tester for a label.
 * @type {RankedTester}
 */
export declare const labelRendererTester: RankedTester;
/**
 * Default renderer for a label.
 */
export declare class LabelRenderer extends Renderer {
    constructor();
    /**
     * @inheritDoc
     */
    render(): HTMLElement;
    /**
     * @inheritDoc
     */
    dispose(): void;
    /**
     * @inheritDoc
     * @param type
     */
    runtimeUpdated(type: RUNTIME_TYPE): void;
}
