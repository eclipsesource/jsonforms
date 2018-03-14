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
var JSX_1 = require("./JSX");
var binding_1 = require("../common/binding");
var UnknownRenderer = /** @class */ (function (_super) {
    __extends(UnknownRenderer, _super);
    function UnknownRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UnknownRenderer.prototype.render = function () {
        return (JSX_1.JSX.createElement("div", { style: { color: 'red' } }, "No applicable renderer found."));
    };
    return UnknownRenderer;
}(binding_1.Component));
exports.UnknownRenderer = UnknownRenderer;
//# sourceMappingURL=unknown.renderer.js.map