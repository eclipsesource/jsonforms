import { Renderer } from '../../core/renderer';
import { ControlProps } from './Control';
/**
 * Convenience base class for all renderers that represent controls.
 */
export declare abstract class BaseControl<P extends ControlProps, S> extends Renderer<P, S> {
    /**
     * @inheritDoc
     */
    render(): any;
    /**
     * Convert the given value before setting it.
     * By default, this just resembles the identify function.
     *
     * @param {any} value the value that may need to be converted
     * @return {any} the converted value
     */
    protected toInput(value: any): any;
    /**
     * Convert the given value before displaying it.
     * By default, this just resembles the identify function.
     *
     * @param {any} value the value that may need to be converted
     * @return {any} the converted value
     */
    protected toModel(value: any): any;
    /**
     * Returns the name of the property that indicates changes
     * @example
     * 'onChange' // in case of a checkbox
     * @return {string} name of the change property
     */
    protected readonly abstract inputChangeProperty: string;
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
     */
    protected abstract createInputElement(): any;
    protected createProps(classNames?: string[], additionalProps?: object): {
        className: string[];
        id: string;
        hidden: boolean;
        disabled: boolean;
    } & object;
    protected getInputValue(input: any): any;
}
export declare const mapStateToControlProps: (state: any, ownProps: any) => {
    data: any;
    errors: any[];
    labelText: string;
    visible: any;
    enabled: any;
    path: string;
};
