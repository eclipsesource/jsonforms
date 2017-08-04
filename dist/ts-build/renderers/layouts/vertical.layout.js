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
var core_1 = require("../../core");
var renderer_1 = require("../../core/renderer");
var testers_1 = require("../../core/testers");
var renderer_util_1 = require("../renderer.util");
var layout_util_1 = require("./layout.util");
/**
 * Default tester for a vertical layout.
 * @type {RankedTester}
 */
exports.verticalLayoutTester = testers_1.rankWith(1, testers_1.uiTypeIs('VerticalLayout'));
/**
 * Default renderer for a vertical layout.
 */
var VerticalLayoutRenderer = (function (_super) {
    __extends(VerticalLayoutRenderer, _super);
    function VerticalLayoutRenderer() {
        return _super.call(this) || this;
    }
    /**
     * @inheritDoc
     */
    VerticalLayoutRenderer.prototype.render = function () {
        var _this = this;
        var div = document.createElement('div');
        core_1.JsonForms.stylingRegistry.addStyle(div, 'vertical-layout');
        var verticalLayout = this.uischema;
        if (verticalLayout.elements !== undefined && verticalLayout.elements !== null) {
            verticalLayout.elements.forEach(function (element) {
                var bestRenderer = core_1.JsonForms.rendererService
                    .findMostApplicableRenderer(element, _this.dataSchema, _this.dataService);
                div.appendChild(bestRenderer);
            });
        }
        this.appendChild(div);
        var childrenSize = div.children.length;
        for (var i = 0; i < childrenSize; i++) {
            var child = div.children.item(i);
            core_1.JsonForms.stylingRegistry
                .addStyle(child, 'vertical-layout-item', childrenSize);
        }
        this.evaluateRuntimeNotification = layout_util_1.createRuntimeNotificationEvaluator(this, this.uischema);
        return this;
    };
    /**
     * @inheritDoc
     */
    VerticalLayoutRenderer.prototype.dispose = function () {
        // Do nothing
    };
    /**
     * @inheritDoc
     */
    VerticalLayoutRenderer.prototype.runtimeUpdated = function (type) {
        this.evaluateRuntimeNotification(type);
    };
    VerticalLayoutRenderer = __decorate([
        renderer_util_1.JsonFormsRenderer({
            selector: 'jsonforms-verticallayout',
            tester: exports.verticalLayoutTester
        }),
        __metadata("design:paramtypes", [])
    ], VerticalLayoutRenderer);
    return VerticalLayoutRenderer;
}(renderer_1.Renderer));
exports.VerticalLayoutRenderer = VerticalLayoutRenderer;
//# sourceMappingURL=vertical.layout.js.map