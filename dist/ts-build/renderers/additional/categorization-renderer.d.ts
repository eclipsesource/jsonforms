import { Renderer } from '../../core/renderer';
import { RUNTIME_TYPE } from '../../core/runtime';
import { RankedTester } from '../../core/testers';
/**
 * Default tester for a categorization.
 * @type {RankedTester}
 */
export declare const categorizationTester: RankedTester;
/**
 * Default renderer for a categorization.
 */
export declare class CategorizationRenderer extends Renderer {
    private master;
    private detail;
    private selected;
    constructor();
    /**
     * @inheritDoc
     */
    dispose(): void;
    /**
     * @inheritDoc
     */
    runtimeUpdated(type: RUNTIME_TYPE): void;
    /**
     * @inheritDoc
     */
    render(): HTMLElement;
    private renderFull();
    private findFirstCategory(categorization, parent);
    private renderMaster();
    private createCategorizationList(categorization);
    private renderDetail(category, li);
}
