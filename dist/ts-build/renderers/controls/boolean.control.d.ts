import { RankedTester } from '../../core/testers';
import { BaseControl } from './base.control';
/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
export declare const booleanControlTester: RankedTester;
/**
 * Default boolean control.
 */
export declare class BooleanControl extends BaseControl<HTMLInputElement> {
    protected configureInput(input: HTMLInputElement): void;
    protected readonly valueProperty: string;
    protected readonly inputChangeProperty: string;
    protected createInputElement(): HTMLInputElement;
}
