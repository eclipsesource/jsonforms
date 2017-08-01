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
var base_control_1 = require("./base.control");
var renderer_util_1 = require("../renderer.util");
/**
 * Default tester for number controls.
 * @type {RankedTester}
 */
exports.numberControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaTypeIs('number')));
/**
 * Default number control.
 */
var NumberControl = (function (_super) {
    __extends(NumberControl, _super);
    function NumberControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberControl.prototype.configureInput = function (input) {
        input.type = 'number';
        input.step = '0.1';
    };
    Object.defineProperty(NumberControl.prototype, "valueProperty", {
        /**
         * @inheritDoc
         */
        get: function () {
            return 'valueAsNumber';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumberControl.prototype, "inputChangeProperty", {
        /**
         * @inheritDoc
         */
        get: function () {
            return 'oninput';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    NumberControl.prototype.createInputElement = function () {
        return document.createElement('input');
    };
    /**
     * @inheritDoc
     */
    NumberControl.prototype.convertModelValue = function (value) {
        return value === undefined || value === null ? undefined : value;
    };
    NumberControl = __decorate([
        renderer_util_1.JsonFormsRenderer({
            selector: 'jsonforms-number',
            tester: exports.numberControlTester
        })
    ], NumberControl);
    return NumberControl;
}(base_control_1.BaseControl));
exports.NumberControl = NumberControl;
//# sourceMappingURL=number.control.js.map