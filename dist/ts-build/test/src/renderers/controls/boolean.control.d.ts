import { RankedTester } from '../../core/testers';
import { BaseControl } from './base.control';
import { ControlProps } from './Control';
/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
export declare const booleanControlTester: RankedTester;
export declare class BooleanControl extends BaseControl<ControlProps, void> {
    inputChangeProperty: string;
    valueProperty: string;
    createInputElement(): any;
}
declare const _default: any;
export default _default;
