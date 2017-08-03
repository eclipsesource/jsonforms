import { RankedTester } from '../../core/testers';
import { BaseControl } from './base.control';
/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export declare const textControlTester: RankedTester;
/**
 * Default text-based/string control.
 */
export declare class TextControl extends BaseControl<HTMLInputElement> {
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
    protected createInputElement(): HTMLInputElement;
}
