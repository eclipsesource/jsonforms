import { RankedTester } from '../../core/testers';
import { BaseControl } from './base.control';
/**
 * Default tester for number controls.
 * @type {RankedTester}
 */
export declare const numberControlTester: RankedTester;
/**
 * Default number control.
 */
export declare class NumberControl extends BaseControl<HTMLInputElement> {
    protected configureInput(input: HTMLInputElement): void;
    /**
     * @inheritDoc
     */
    protected readonly valueProperty: string;
    /**
     * @inheritDoc
     */
    protected readonly inputChangeProperty: string;
    /**
     * @inheritDoc
     */
    protected createInputElement(): HTMLInputElement;
    /**
     * @inheritDoc
     */
    protected convertModelValue(value: any): any;
}
