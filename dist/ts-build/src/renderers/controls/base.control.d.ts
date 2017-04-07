import { ControlElement } from '../../models/uischema';
import { Renderer } from '../../core/renderer';
import { DataChangeListener } from '../../core/data.service';
import { RUNTIME_TYPE } from '../../core/runtime';
export declare abstract class BaseControl<T extends HTMLElement> extends Renderer implements DataChangeListener {
    private label;
    private input;
    private errorElement;
    private static formatErrorMessage(errors);
    constructor();
    render(): HTMLElement;
    dispose(): void;
    notify(type: RUNTIME_TYPE): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    isRelevantKey(uischema: ControlElement): boolean;
    notifyChange(uischema: ControlElement, newValue: any, data: any): void;
    protected convertModelValue(value: any): any;
    protected convertInputValue(value: any): any;
    protected readonly abstract inputChangeProperty: string;
    protected abstract configureInput(input: T): void;
    protected readonly abstract valueProperty: string;
    protected readonly abstract inputElement: T;
    private createLabel(controlElement);
    private createInput(controlElement);
    private getValue(input);
    private setValue(input, value);
}
