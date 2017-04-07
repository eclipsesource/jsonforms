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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var renderer_1 = require("../../core/renderer");
var renderer_util_1 = require("../renderer.util");
var LabelRenderer = (function (_super) {
    __extends(LabelRenderer, _super);
    function LabelRenderer() {
        return _super.call(this) || this;
    }
    LabelRenderer.prototype.render = function () {
        var labelElement = this.uischema;
        var label = document.createElement('label');
        if (typeof labelElement.text === 'string') {
            label.innerText = labelElement.text;
        }
        this.appendChild(label);
        this.className = 'jsf-label';
        return this;
    };
    LabelRenderer.prototype.dispose = function () {
        // Do nothing
    };
    return LabelRenderer;
}(renderer_1.Renderer));
LabelRenderer = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-label',
        tester: function (uischema) { return uischema.type === 'Label' ? 1 : -1; }
    }),
    __metadata("design:paramtypes", [])
], LabelRenderer);
//# sourceMappingURL=label.renderer.js.map