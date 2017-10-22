import { RankedTester } from '../../core/testers';
import { BaseControl } from './base.control';
import { ControlProps } from './Control';
/**
 * Default tester for integer controls.
 * @type {RankedTester}
 */
export declare const integerControlTester: RankedTester;
export declare class IntegerControl extends BaseControl<ControlProps, void> {
    inputChangeProperty: string;
    valueProperty: string;
    /**
     * @inheritDoc
     */
    protected toModel(value: any): any;
    /**
     * @inheritDoc
     */
    protected createInputElement(): any;
}
declare const _default: any;
export default _default;
