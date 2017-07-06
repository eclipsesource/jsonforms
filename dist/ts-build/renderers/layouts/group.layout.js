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
 * Default tester for a group layout.
 *
 * @type {RankedTester}
 */
exports.groupTester = testers_1.rankWith(1, testers_1.uiTypeIs('Group'));
/**
 * Default renderer for a group layout.
 */
var GroupLayoutRenderer = (function (_super) {
    __extends(GroupLayoutRenderer, _super);
    function GroupLayoutRenderer() {
        return _super.call(this) || this;
    }
    /**
     * @inheritDoc
     */
    GroupLayoutRenderer.prototype.render = function () {
        var _this = this;
        var group = this.uischema;
        var fieldset = document.createElement('fieldset');
        fieldset.className = 'group-layout';
        if (group.label !== undefined) {
            var legend = document.createElement('legend');
            legend.innerText = group.label;
            fieldset.appendChild(legend);
        }
        if (group.elements !== undefined && group.elements !== null) {
            group.elements.forEach(function (element) {
                var bestRenderer = core_1.JsonForms.rendererService
                    .findMostApplicableRenderer(element, _this.dataSchema, _this.dataService);
                fieldset.appendChild(bestRenderer);
            });
        }
        this.appendChild(fieldset);
        this.evaluateRuntimeNotification = layout_util_1.createRuntimeNotificationEvaluator(this, this.uischema);
        return this;
    };
    /**
     * @inheritDoc
     */
    GroupLayoutRenderer.prototype.dispose = function () {
        // Do nothing
    };
    /**
     * @inheritDoc
     */
    GroupLayoutRenderer.prototype.runtimeUpdated = function (type) {
        this.evaluateRuntimeNotification(type);
    };
    GroupLayoutRenderer = __decorate([
        renderer_util_1.JsonFormsRenderer({
            selector: 'jsonforms-grouplayout',
            tester: exports.groupTester
        }),
        __metadata("design:paramtypes", [])
    ], GroupLayoutRenderer);
    return GroupLayoutRenderer;
}(renderer_1.Renderer));
exports.GroupLayoutRenderer = GroupLayoutRenderer;
//# sourceMappingURL=group.layout.js.map