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
var path_util_1 = require("../../path.util");
var renderer_util_1 = require("../renderer.util");
var base_control_1 = require("./base.control");
/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
exports.enumControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaMatches(function (schema) { return schema.hasOwnProperty('enum'); })));
/**
 * Default enum control.
 */
var EnumControl = (function (_super) {
    __extends(EnumControl, _super);
    function EnumControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @inheritDoc
     */
    EnumControl.prototype.configureInput = function (input) {
        this.options = path_util_1.resolveSchema(this.dataSchema, this.uischema.scope.$ref).enum;
        this.options.forEach(function (optionValue) {
            var option = document.createElement('option');
            option.value = optionValue;
            option.label = optionValue;
            input.appendChild(option);
        });
        input.classList.add('form-control');
    };
    Object.defineProperty(EnumControl.prototype, "valueProperty", {
        /**
         * @inheritDoc
         */
        get: function () {
            return 'value';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnumControl.prototype, "inputChangeProperty", {
        /**
         * @inheritDoc
         */
        get: function () {
            return 'onchange';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EnumControl.prototype.createInputElement = function () {
        return document.createElement('select');
    };
    /**
     * @inheritDoc
     */
    EnumControl.prototype.convertModelValue = function (value) {
        return (value === undefined || value === null) ? undefined : value;
    };
    EnumControl = __decorate([
        renderer_util_1.JsonFormsRenderer({
            selector: 'jsonforms-enum',
            tester: exports.enumControlTester
        })
    ], EnumControl);
    return EnumControl;
}(base_control_1.BaseControl));
exports.EnumControl = EnumControl;
//# sourceMappingURL=enum.control.js.map