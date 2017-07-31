"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var renderer_1 = require("../../core/renderer");
var runtime_1 = require("../../core/runtime");
var label_util_1 = require("../label.util");
/**
 * Convenience base class for all renderers that represent controls.
 */
var BaseControl = (function (_super) {
    __extends(BaseControl, _super);
    /**
     * Default constructor.
     */
    function BaseControl() {
        return _super.call(this) || this;
    }
    BaseControl.formatErrorMessage = function (errors) {
        if (errors === undefined || errors === null) {
            return '';
        }
        return errors.join('\n');
    };
    /**
     * @inheritDoc
     */
    BaseControl.prototype.render = function () {
        var controlElement = this.uischema;
        this.createLabel(controlElement);
        this.createInput(controlElement);
        this.input.classList.add('input');
        this.errorElement = document.createElement('div');
        this.errorElement.classList.add('validation');
        this.appendChild(this.label);
        this.appendChild(this.input);
        this.appendChild(this.errorElement);
        this.classList.add('control');
        return this;
    };
    /**
     * @inheritDoc
     */
    BaseControl.prototype.dispose = function () {
        // Do nothing
    };
    /**
     * @inheritDoc
     */
    BaseControl.prototype.runtimeUpdated = function (type) {
        var runtime = this.uischema.runtime;
        switch (type) {
            case runtime_1.RUNTIME_TYPE.VALIDATION_ERROR:
                this.errorElement.textContent = BaseControl.formatErrorMessage(runtime.validationErrors);
                this.classList.toggle('validation_error', runtime.validationErrors !== undefined);
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
    };
    /**
     * @inheritDoc
     */
    BaseControl.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.dataService.registerDataChangeListener(this);
    };
    /**
     * @inheritDoc
     */
    BaseControl.prototype.disconnectedCallback = function () {
        this.dataService.deregisterDataChangeListener(this);
        _super.prototype.disconnectedCallback.call(this);
    };
    /**
     * @inheritDoc
     */
    BaseControl.prototype.needsNotificationAbout = function (controlElement) {
        if (controlElement === undefined || controlElement === null) {
            return false;
        }
        return this.uischema.scope.$ref === controlElement.scope.$ref;
    };
    /**
     * @inheritDoc
     */
    BaseControl.prototype.dataChanged = function (controlElement, newValue, data) {
        this.setValue(this.input, newValue);
    };
    /**
     * Convert the given value before setting it.
     * By default, this just resembles the identify function.
     *
     * @param {any} value the value that may need to be converted
     * @return {any} the converted value
     */
    BaseControl.prototype.convertModelValue = function (value) {
        return value;
    };
    /**
     * Convert the given value before displaying it.
     * By default, this just resembles the identify function.
     *
     * @param {any} value the value that may need to be converted
     * @return {any} the converted value
     */
    BaseControl.prototype.convertInputValue = function (value) {
        return value;
    };
    BaseControl.prototype.createLabel = function (controlElement) {
        this.label = document.createElement('label');
        var labelObject = label_util_1.getElementLabelObject(this.dataSchema, controlElement);
        if (labelObject.show) {
            this.label.textContent = labelObject.text;
        }
    };
    BaseControl.prototype.createInput = function (controlElement) {
        var _this = this;
        this.input = this.createInputElement();
        this.configureInput(this.input);
        this.input[this.inputChangeProperty] = (function (ev) {
            _this.dataService.notifyAboutDataChange(controlElement, _this.getValue(_this.input));
        });
        this.setValue(this.input, this.dataService.getValue(controlElement));
    };
    BaseControl.prototype.getValue = function (input) {
        return this.convertInputValue(input[this.valueProperty]);
    };
    BaseControl.prototype.setValue = function (input, value) {
        input[this.valueProperty] = this.convertModelValue(value);
    };
    return BaseControl;
}(renderer_1.Renderer));
exports.BaseControl = BaseControl;
//# sourceMappingURL=base.control.js.map