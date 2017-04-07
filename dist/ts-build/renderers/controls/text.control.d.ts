import { UISchemaElement } from '../../models/uischema';
import { BaseControl } from './base.control';
export declare const TextControlTester: (uischema: UISchemaElement) => 1 | -1;
export declare class TextControl extends BaseControl<HTMLInputElement> {
    protected configureInput(input: HTMLInputElement): void;
    protected readonly valueProperty: string;
    protected readonly inputChangeProperty: string;
    protected convertModelValue(value: any): any;
    protected readonly inputElement: HTMLInputElement;
}
