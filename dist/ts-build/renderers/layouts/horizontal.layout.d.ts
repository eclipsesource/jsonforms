import { Renderer } from '../../core/renderer';
import { RUNTIME_TYPE } from '../../core/runtime';
import { RankedTester } from '../../core/testers';
/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export declare const horizontalLayoutTester: RankedTester;
/**
 * Default renderer for a horizontal layout.
 */
export declare class HorizontalLayoutRenderer extends Renderer {
    private evaluateRuntimeNotification;
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
     */
    runtimeUpdated(type: RUNTIME_TYPE): void;
}
