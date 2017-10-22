import { Renderer, RendererProps } from '../../core/renderer';
import { RankedTester } from '../../core/testers';
/**
 * Default tester for a label.
 * @type {RankedTester}
 */
export declare const labelRendererTester: RankedTester;
/**
 * Default renderer for a label.
 */
export declare class LabelRenderer extends Renderer<RendererProps, void> {
    /**
     * @inheritDoc
     */
    render(): any;
}
declare const _default: any;
export default _default;
