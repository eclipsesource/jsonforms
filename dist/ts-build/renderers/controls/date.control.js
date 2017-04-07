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
var path_util_1 = require("../../path.util");
var DateControl = (function (_super) {
    __extends(DateControl, _super);
    function DateControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateControl.prototype.configureInput = function (input) {
        input.type = 'date';
        input.classList.add('form-control');
    };
    Object.defineProperty(DateControl.prototype, "valueProperty", {
        get: function () {
            return 'valueAsDate';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateControl.prototype, "inputChangeProperty", {
        get: function () {
            return 'oninput';
        },
        enumerable: true,
        configurable: true
    });
    DateControl.prototype.convertModelValue = function (value) {
        return new Date(value);
    };
    DateControl.prototype.convertInputValue = function (value) {
        if (value === null) {
            return undefined;
        }
        return value.toISOString().substr(0, 10);
    };
    Object.defineProperty(DateControl.prototype, "inputElement", {
        get: function () {
            return document.createElement('input');
        },
        enumerable: true,
        configurable: true
    });
    return DateControl;
}(base_control_1.BaseControl));
DateControl = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-date',
        tester: function (uischema, schema) {
            if (uischema.type !== 'Control') {
                return -1;
            }
            var localSchema = path_util_1.resolveSchema(schema, uischema.scope.$ref);
            if (localSchema.type === 'string' && localSchema.format === 'date') {
                return 2;
            }
            return -1;
        }
    })
], DateControl);
//# sourceMappingURL=date.control.js.map