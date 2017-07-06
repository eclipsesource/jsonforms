import { RankedTester } from '../../core/testers';
import { BaseControl } from './base.control';
/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
export declare const enumControlTester: RankedTester;
/**
 * Default enum control.
 */
export declare class EnumControl extends BaseControl<HTMLSelectElement> {
    private options;
    /**
     * @inheritDoc
     */
    protected configureInput(input: HTMLSelectElement): void;
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
    protected createInputElement(): HTMLSelectElement;
    /**
     * @inheritDoc
     */
    protected convertModelValue(value: any): any;
}
