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
var renderer_util_1 = require("../renderer.util");
var renderer_1 = require("../../core/renderer");
var testers_1 = require("../../core/testers");
var runtime_1 = require("../../core/runtime");
var core_1 = require("../../core");
/**
 * Default tester for a label.
 * @type {RankedTester}
 */
exports.labelRendererTester = testers_1.rankWith(1, testers_1.uiTypeIs('Label'));
/**
 * Default renderer for a label.
 */
var LabelRenderer = (function (_super) {
    __extends(LabelRenderer, _super);
    function LabelRenderer() {
        return _super.call(this) || this;
    }
    /**
     * @inheritDoc
     */
    LabelRenderer.prototype.render = function () {
        var labelElement = this.uischema;
        if (labelElement.text !== undefined && labelElement.text !== null) {
            this.textContent = labelElement.text;
        }
        this.className = core_1.JsonForms.stylingRegistry.getAsClassName('label-control');
        return this;
    };
    /**
     * @inheritDoc
     */
    LabelRenderer.prototype.dispose = function () {
        // Do nothing
    };
    /**
     * @inheritDoc
     * @param type
     */
    LabelRenderer.prototype.runtimeUpdated = function (type) {
        var runtime = this.uischema.runtime;
        switch (type) {
            case runtime_1.RUNTIME_TYPE.VISIBLE:
                this.hidden = !runtime.visible;
                break;
            case runtime_1.RUNTIME_TYPE.ENABLED:
                if (!runtime.enabled) {
                    this.setAttribute('disabled', 'true');
                }
                else {
                    this.removeAttribute('disabled');
                }
                break;
            default:
        }
    };
    LabelRenderer = __decorate([
        renderer_util_1.JsonFormsRenderer({
            selector: 'jsonforms-label',
            tester: exports.labelRendererTester
        }),
        __metadata("design:paramtypes", [])
    ], LabelRenderer);
    return LabelRenderer;
}(renderer_1.Renderer));
exports.LabelRenderer = LabelRenderer;
//# sourceMappingURL=label.renderer.js.map