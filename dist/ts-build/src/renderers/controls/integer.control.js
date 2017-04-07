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
var IntegerControl = (function (_super) {
    __extends(IntegerControl, _super);
    function IntegerControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntegerControl.prototype.configureInput = function (input) {
        input.type = 'number';
        input.step = '1';
        input.classList.add('form-control');
    };
    Object.defineProperty(IntegerControl.prototype, "valueProperty", {
        get: function () {
            return 'valueAsNumber';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IntegerControl.prototype, "inputChangeProperty", {
        get: function () {
            return 'oninput';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IntegerControl.prototype, "inputElement", {
        get: function () {
            return document.createElement('input');
        },
        enumerable: true,
        configurable: true
    });
    return IntegerControl;
}(base_control_1.BaseControl));
IntegerControl = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-integer',
        tester: function (uischema, schema) {
            return uischema.type === 'Control'
                && path_util_1.resolveSchema(schema, uischema.scope.$ref).type === 'integer' ? 2 : -1;
        }
    })
], IntegerControl);
//# sourceMappingURL=integer.control.js.map