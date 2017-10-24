import { RankedTester } from '../../core/testers';
import { Control, ControlProps } from './Control';
/**
 * Tester for a multi-line string control.
 * @type {RankedTester}
 */
export declare const textAreaControlTester: RankedTester;
export declare class TextAreaControl extends Control<ControlProps, void> {
    render(): any;
    /**
     * @inheritDoc
     */
    protected toInput(value: any): any;
}
declare const _default: any;
export default _default;
