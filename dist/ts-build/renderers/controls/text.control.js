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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_control_1 = require("./base.control");
var renderer_util_1 = require("../renderer.util");
exports.TextControlTester = function (uischema) {
    return uischema !== undefined && uischema !== null && uischema.type === 'Control' ? 1 : -1;
};
var TextControl = (function (_super) {
    __extends(TextControl, _super);
    function TextControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextControl.prototype.configureInput = function (input) {
        input.type = 'text';
        input.classList.add('form-control');
    };
    Object.defineProperty(TextControl.prototype, "valueProperty", {
        get: function () {
            return 'value';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextControl.prototype, "inputChangeProperty", {
        get: function () {
            return 'oninput';
        },
        enumerable: true,
        configurable: true
    });
    TextControl.prototype.convertModelValue = function (value) {
        return value === undefined ? '' : value;
    };
    Object.defineProperty(TextControl.prototype, "inputElement", {
        get: function () {
            return document.createElement('input');
        },
        enumerable: true,
        configurable: true
    });
    return TextControl;
}(base_control_1.BaseControl));
TextControl = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-text',
        tester: exports.TextControlTester
    })
], TextControl);
exports.TextControl = TextControl;
//# sourceMappingURL=text.control.js.map