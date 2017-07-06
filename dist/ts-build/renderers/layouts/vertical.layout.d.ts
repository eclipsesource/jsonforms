import { Renderer } from '../../core/renderer';
import { RUNTIME_TYPE } from '../../core/runtime';
import { RankedTester } from '../../core/testers';
/**
 * Default tester for a vertical layout.
 * @type {RankedTester}
 */
export declare const verticalLayoutTester: RankedTester;
/**
 * Default renderer for a vertical layout.
 */
export declare class VerticalLayoutRenderer extends Renderer {
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
