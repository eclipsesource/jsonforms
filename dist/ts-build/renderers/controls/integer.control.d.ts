import { RankedTester } from '../../core/testers';
import { BaseControl } from './base.control';
/**
 * Default tester for integer controls.
 * @type {RankedTester}
 */
export declare const integerControlTester: RankedTester;
/**
 * Default integer control.
 */
export declare class IntegerControl extends BaseControl<HTMLInputElement> {
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
    protected createInputElement(): HTMLInputElement;
    /**
     * @inheritDoc
     */
    protected convertModelValue(value: any): any;
}
