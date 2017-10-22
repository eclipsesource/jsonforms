import { RankedTester } from '../../core/testers';
import { BaseControl } from './base.control';
import { ControlProps } from './Control';
/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export declare const textControlTester: RankedTester;
export declare class TextControl extends BaseControl<ControlProps, void> {
    inputChangeProperty: string;
    valueProperty: string;
    protected toInput(value: any): any;
    protected createInputElement(): any;
}
declare const _default: any;
export default _default;
