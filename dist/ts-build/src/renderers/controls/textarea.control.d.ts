import { RankedTester } from '../../core/testers';
import { BaseControl } from './base.control';
/**
 * Tester for a multi-line string control.
 * @type {RankedTester}
 */
export declare const textAreaControlTester: RankedTester;
/**
 * Renderer for a multi-line string control.
 */
export declare class TextAreaControl extends BaseControl<HTMLTextAreaElement> {
    /**
     * @inheritDoc
     */
    protected configureInput(input: HTMLTextAreaElement): void;
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
    protected createInputElement(): HTMLTextAreaElement;
}
