import { Renderer } from '../../core/renderer';
import { RUNTIME_TYPE } from '../../core/runtime';
import { RankedTester } from '../../core/testers';
/**
 * Default tester for a group layout.
 *
 * @type {RankedTester}
 */
export declare const groupTester: RankedTester;
/**
 * Default renderer for a group layout.
 */
export declare class GroupLayoutRenderer extends Renderer {
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
