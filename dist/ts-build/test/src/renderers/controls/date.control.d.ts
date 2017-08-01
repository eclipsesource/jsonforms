import { RankedTester } from '../../core/testers';
import { BaseControl } from './base.control';
/**
 * Default tester for date controls.
 * @type {RankedTester}
 */
export declare const dateControlTester: RankedTester;
/**
 * Default date control.
 */
export declare class DateControl extends BaseControl<HTMLInputElement> {
    /**
     * @inheritDoc
     */
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
    protected convertModelValue(value: any): any;
    /**
     * @inheritDoc
     */
    protected convertInputValue(value: any): any;
    /**
     * @inheritDoc
     */
    protected createInputElement(): HTMLInputElement;
}
