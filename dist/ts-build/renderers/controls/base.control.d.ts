import { DataChangeListener } from '../../core/data.service';
import { Renderer } from '../../core/renderer';
import { RUNTIME_TYPE } from '../../core/runtime';
import { ControlElement } from '../../models/uischema';
/**
 * Convenience base class for all renderers that represent controls.
 */
export declare abstract class BaseControl<T extends HTMLElement> extends Renderer implements DataChangeListener {
    private label;
    private input;
    private errorElement;
    private static formatErrorMessage(errors);
    /**
     * Default constructor.
     */
    constructor();
    /**
     * @inheritDoc
     */
    render(): HTMLElement;
    /**
     * @inheritDoc
     */
    dispose(): void;
    /**
     * @inheritDoc
     */
    runtimeUpdated(type: RUNTIME_TYPE): void;
    /**
     * @inheritDoc
     */
    connectedCallback(): void;
    /**
     * @inheritDoc
     */
    disconnectedCallback(): void;
    /**
     * @inheritDoc
     */
    needsNotificationAbout(controlElement: ControlElement): boolean;
    /**
     * @inheritDoc
     */
    dataChanged(controlElement: ControlElement, newValue: any, data: any): void;
    /**
     * Convert the given value before setting it.
     * By default, this just resembles the identify function.
     *
     * @param {any} value the value that may need to be converted
     * @return {any} the converted value
     */
    protected convertModelValue(value: any): any;
    /**
     * Convert the given value before displaying it.
     * By default, this just resembles the identify function.
     *
     * @param {any} value the value that may need to be converted
     * @return {any} the converted value
     */
    protected convertInputValue(value: any): any;
    /**
     * Returns the name of the property that indicates changes
     * @example
     * 'onChange' // in case of a checkbox
     * @return {string} name of the change property
     */
    protected readonly abstract inputChangeProperty: string;
    /**
     * Configure the created input element.
     *
     * @param input the input element to be configured
     *
     * @see createInputElement
     */
    protected abstract configureInput(input: T): void;
    /**
     * Returns the name of the property that represents the actual value.
     * @example
     * 'checked' // in case of a checkbox
     * @return the name of the value property
     */
    protected readonly abstract valueProperty: string;
    /**
     * Create and return a HTML element that is used
     * to enter/update any data.
     *
     * @returns {T} the created HTML input element
     */
    protected abstract createInputElement(): T;
    private createLabel(controlElement);
    private createInput(controlElement);
    private getValue(input);
    private setValue(input, value);
}
