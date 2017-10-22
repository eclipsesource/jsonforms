import { RankedTester } from '../../core/testers';
import { BaseControl } from './base.control';
import { ControlProps } from './Control';
/**
 * Tester for a multi-line string control.
 * @type {RankedTester}
 */
export declare const textAreaControlTester: RankedTester;
export declare class TextAreaControl extends BaseControl<ControlProps, void> {
    protected inputChangeProperty: string;
    protected valueProperty: string;
    protected createInputElement(): any;
    /**
     * @inheritDoc
     */
    protected toInput(value: any): any;
}
declare const _default: any;
export default _default;
