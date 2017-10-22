import { RankedTester } from '../../core/testers';
import { BaseControl } from './base.control';
import { ControlProps } from './Control';
/**
 * Default tester for date controls.
 * @type {RankedTester}
 */
export declare const dateControlTester: RankedTester;
export declare class DateControl extends BaseControl<ControlProps, void> {
    inputChangeProperty: string;
    valueProperty: string;
    protected createInputElement(): any;
    /**
     * @inheritDoc
     */
    protected toInput(value: any): any;
    /**
     * @inheritDoc
     */
    protected toModel(value: any): any;
}
declare const _default: any;
export default _default;
