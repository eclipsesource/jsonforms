import { RankedTester } from '../../core/testers';
import { BaseControl } from './base.control';
import { ControlProps } from './Control';
/**
 * Default tester for number controls.
 * @type {RankedTester}
 */
export declare const numberControlTester: RankedTester;
export declare class NumberControl extends BaseControl<ControlProps, void> {
    inputChangeProperty: string;
    valueProperty: string;
    /**
     * @inheritDoc
     */
    protected createInputElement(): any;
    /**
     * @inheritDoc
     */
    protected toModel(value: any): any;
    /**
     * @inheritDoc
     */
    protected toInput(value: any): any;
}
declare const _default: any;
export default _default;
