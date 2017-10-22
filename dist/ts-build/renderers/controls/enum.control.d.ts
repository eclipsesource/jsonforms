import { RankedTester } from '../../core/testers';
import { BaseControl } from './base.control';
import { ControlProps } from './Control';
/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
export declare const enumControlTester: RankedTester;
export declare class EnumControl extends BaseControl<ControlProps, void> {
    valueProperty: string;
    createInputElement(): any;
    /**
     * @inheritDoc
     */
    protected readonly inputChangeProperty: string;
    /**
     * @inheritDoc
     */
    protected toInput(value: any): any;
}
declare const _default: any;
export default _default;
