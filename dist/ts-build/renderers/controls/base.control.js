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
var label_util_1 = require("../label.util");
var runtime_1 = require("../../core/runtime");
var BaseControl = (function (_super) {
    __extends(BaseControl, _super);
    function BaseControl() {
        return _super.call(this) || this;
    }
    BaseControl.formatErrorMessage = function (errors) {
        if (errors === undefined) {
            return '';
        }
        return errors.join('\n');
    };
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
    BaseControl.prototype.dispose = function () {
        // Do nothing
    };
    BaseControl.prototype.notify = function (type) {
        var runtime = this.uischema['runtime'];
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
        }
    };
    BaseControl.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.dataService.registerChangeListener(this);
    };
    BaseControl.prototype.disconnectedCallback = function () {
        this.dataService.unregisterChangeListener(this);
        _super.prototype.disconnectedCallback.call(this);
    };
    BaseControl.prototype.isRelevantKey = function (uischema) {
        if (uischema === undefined || uischema === null) {
            return false;
        }
        return this.uischema.scope.$ref === uischema.scope.$ref;
    };
    BaseControl.prototype.notifyChange = function (uischema, newValue, data) {
        this.setValue(this.input, newValue);
    };
    BaseControl.prototype.convertModelValue = function (value) {
        return value;
    };
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
        this.input = this.inputElement;
        this.configureInput(this.input);
        this.input[this.inputChangeProperty] = (function (ev) {
            return _this.dataService.notifyChange(controlElement, _this.getValue(_this.input));
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