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
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
exports.horizontalLayoutTester = testers_1.rankWith(1, testers_1.uiTypeIs('HorizontalLayout'));
/**
 * Default renderer for a horizontal layout.
 */
var HorizontalLayoutRenderer = (function (_super) {
    __extends(HorizontalLayoutRenderer, _super);
    function HorizontalLayoutRenderer() {
        return _super.call(this) || this;
    }
    /**
     * @inheritDoc
     */
    HorizontalLayoutRenderer.prototype.render = function () {
        var _this = this;
        var div = document.createElement('div');
        div.className = 'horizontal-layout';
        var horizontalLayout = this.uischema;
        if (horizontalLayout.elements !== undefined && horizontalLayout.elements !== null) {
            horizontalLayout.elements.forEach(function (element) {
                var bestRenderer = core_1.JsonForms.rendererService
                    .findMostApplicableRenderer(element, _this.dataSchema, _this.dataService);
                div.appendChild(bestRenderer);
            });
        }
        this.appendChild(div);
        this.evaluateRuntimeNotification = layout_util_1.createRuntimeNotificationEvaluator(this, this.uischema);
        return this;
    };
    /**
     * @inheritDoc
     */
    HorizontalLayoutRenderer.prototype.dispose = function () {
        // Do nothing
    };
    /**
     * @inheritDoc
     */
    HorizontalLayoutRenderer.prototype.runtimeUpdated = function (type) {
        this.evaluateRuntimeNotification(type);
    };
    HorizontalLayoutRenderer = __decorate([
        renderer_util_1.JsonFormsRenderer({
            selector: 'jsonforms-horizontallayout',
            tester: exports.horizontalLayoutTester
        }),
        __metadata("design:paramtypes", [])
    ], HorizontalLayoutRenderer);
    return HorizontalLayoutRenderer;
}(renderer_1.Renderer));
exports.HorizontalLayoutRenderer = HorizontalLayoutRenderer;
//# sourceMappingURL=horizontal.layout.js.map