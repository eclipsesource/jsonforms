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
var inferno_1 = require("inferno");
var inferno_redux_1 = require("inferno-redux");
exports.render = inferno_1.default.render;
exports.connect = inferno_redux_1.connect;
exports.Provider = inferno_redux_1.Provider;
var inferno_component_1 = require("inferno-component");
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Component;
}(inferno_component_1.default));
exports.Component = Component;
var inferno_create_element_1 = require("inferno-create-element");
exports.createElement = inferno_create_element_1.default;
//# sourceMappingURL=inferno.js.map