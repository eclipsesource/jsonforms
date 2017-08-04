"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const renderer_1 = require("../../core/renderer");
const runtime_1 = require("../../core/runtime");
const label_util_1 = require("../label.util");
const core_1 = require("../../core");
/**
 * Convenience base class for all renderers that represent controls.
 */
class BaseControl extends renderer_1.Renderer {
    /**
     * Default constructor.
     */
    constructor() {
        super();
    }
    static formatErrorMessage(errors) {
        if (errors === undefined || errors === null) {
            return '';
        }
        return errors.join('\n');
    }
    /**
     * @inheritDoc
     */
    render() {
        const controlElement = this.uischema;
        this.createLabel(controlElement);
        this.createInput(controlElement);
        this.errorElement = document.createElement('div');
        this.appendChild(this.label);
        this.appendChild(this.input);
        this.appendChild(this.errorElement);
        this.classList.add(this.convertToClassName(controlElement.scope.$ref));
        core_1.JsonForms.stylingRegistry
            .addStyle(this, 'control')
            .addStyle(this.label, 'control.label')
            .addStyle(this.input, 'control.input')
            .addStyle(this.errorElement, 'control.validation');
        return this;
    }
    /**
     * @inheritDoc
     */
    dispose() {
        // Do nothing
    }
    /**
     * @inheritDoc
     */
    runtimeUpdated(type) {
        const runtime = this.uischema.runtime;
        switch (type) {
            case runtime_1.RUNTIME_TYPE.VALIDATION_ERROR:
                this.errorMessage = BaseControl.formatErrorMessage(runtime.validationErrors);
                this.errorElement.textContent = this.errorMessage;
                this.classList.toggle('validation_error', runtime.validationErrors !== undefined);
                if (runtime.validationErrors === undefined) {
                    this.input.classList.add('valid');
                    this.input.classList.remove('invalid');
                }
                else {
                    this.input.classList.add('invalid');
                    this.input.classList.remove('valid');
                }
                break;
            case runtime_1.RUNTIME_TYPE.VISIBLE:
                this.hidden = !runtime.visible;
                break;
            case runtime_1.RUNTIME_TYPE.ENABLED:
                if (!runtime.enabled) {
                    this.input.setAttribute('disabled', 'true');
                }
                else {
                    this.input.removeAttribute('disabled');
                }
                break;
            default:
        }
    }
    /**
     * @inheritDoc
     */
    connectedCallback() {
        super.connectedCallback();
        this.dataService.registerDataChangeListener(this);
    }
    /**
     * @inheritDoc
     */
    disconnectedCallback() {
        this.dataService.deregisterDataChangeListener(this);
        super.disconnectedCallback();
    }
    /**
     * @inheritDoc
     */
    needsNotificationAbout(controlElement) {
        if (controlElement === undefined || controlElement === null) {
            return false;
        }
        return this.uischema.scope.$ref === controlElement.scope.$ref;
    }
    /**
     * @inheritDoc
     */
    dataChanged(controlElement, newValue, data) {
        this.setValue(this.input, newValue);
    }
    /**
     * Convert the given value before setting it.
     * By default, this just resembles the identify function.
     *
     * @param {any} value the value that may need to be converted
     * @return {any} the converted value
     */
    convertModelValue(value) {
        return value;
    }
    /**
     * Convert the given value before displaying it.
     * By default, this just resembles the identify function.
     *
     * @param {any} value the value that may need to be converted
     * @return {any} the converted value
     */
    convertInputValue(value) {
        return value;
    }
    createLabel(controlElement) {
        this.label = document.createElement('label');
        // TODO: see issue #590
        this.label.htmlFor = controlElement.scope.$ref;
        const labelObject = label_util_1.getElementLabelObject(this.dataSchema, controlElement);
        if (labelObject.show) {
            this.label.textContent = labelObject.text;
        }
    }
    createInput(controlElement) {
        this.input = this.createInputElement();
        // TODO: see issue #590
        this.input.id = controlElement.scope.$ref;
        this.configureInput(this.input);
        this.input[this.inputChangeProperty] = ((ev) => {
            this.dataService.notifyAboutDataChange(controlElement, this.getValue(this.input));
        });
        this.input.className += ' validate';
        this.setValue(this.input, this.dataService.getValue(controlElement));
    }
    getValue(input) {
        return this.convertInputValue(input[this.valueProperty]);
    }
    setValue(input, value) {
        input[this.valueProperty] = this.convertModelValue(value);
    }
}
exports.BaseControl = BaseControl;
//# sourceMappingURL=base.control.js.map