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
var testers_1 = require("../../core/testers");
var renderer_util_1 = require("../renderer.util");
var base_control_1 = require("./base.control");
var core_1 = require("../../core");
/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
exports.booleanControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaTypeIs('boolean')));
/**
 * Default boolean control.
 */
var BooleanControl = (function (_super) {
    __extends(BooleanControl, _super);
    function BooleanControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BooleanControl.prototype.render = function () {
        var controlElement = this.uischema;
        this.createInput(controlElement);
        this.createLabel(controlElement);
        this.errorElement = document.createElement('div');
        this.appendChild(this.input);
        this.appendChild(this.label);
        this.appendChild(this.errorElement);
        this.classList.add(this.convertToClassName(controlElement.scope.$ref));
        core_1.JsonForms.stylingRegistry
            .addStyle(this, 'control')
            .addStyle(this.label, 'control.label')
            .addStyle(this.input, 'control.input')
            .addStyle(this.errorElement, 'control.validation');
        return this;
    };
    BooleanControl.prototype.configureInput = function (input) {
        input.type = 'checkbox';
    };
    Object.defineProperty(BooleanControl.prototype, "valueProperty", {
        get: function () {
            return 'checked';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BooleanControl.prototype, "inputChangeProperty", {
        get: function () {
            return 'onchange';
        },
        enumerable: true,
        configurable: true
    });
    BooleanControl.prototype.createInputElement = function () {
        return document.createElement('input');
    };
    BooleanControl = __decorate([
        renderer_util_1.JsonFormsRenderer({
            selector: 'jsonforms-boolean',
            tester: exports.booleanControlTester
        })
    ], BooleanControl);
    return BooleanControl;
}(base_control_1.BaseControl));
exports.BooleanControl = BooleanControl;
//# sourceMappingURL=boolean.control.js.map