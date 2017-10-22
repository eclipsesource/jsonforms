import { RankedTester } from '../../src/core/testers';
import { Control, ControlProps } from '../../src/renderers/controls/Control';
/**
 * Default tester for integer controls.
 * @type {RankedTester}
 */
export declare const ratingControlTester: RankedTester;
export declare class RatingControl extends Control<ControlProps, void> {
    /**
     * @inheritDoc
     */
    render(): any;
    private onClick(ev);
}
