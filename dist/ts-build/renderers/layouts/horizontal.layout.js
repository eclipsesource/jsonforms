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
var JSX_1 = require("../JSX");
var renderer_1 = require("../../core/renderer");
var testers_1 = require("../../core/testers");
var renderer_util_1 = require("../renderer.util");
var inferno_redux_1 = require("inferno-redux");
/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
exports.horizontalLayoutTester = testers_1.rankWith(1, testers_1.uiTypeIs('HorizontalLayout'));
var HorizontalLayoutRenderer = /** @class */ (function (_super) {
    __extends(HorizontalLayoutRenderer, _super);
    function HorizontalLayoutRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @inheritDoc
     */
    HorizontalLayoutRenderer.prototype.render = function () {
        var _a = this.props, schema = _a.schema, uischema = _a.uischema, path = _a.path, visible = _a.visible;
        var horizontalLayout = uischema;
        return (JSX_1.JSX.createElement(renderer_util_1.JsonFormsLayout, { styleName: 'horizontal-layout', visible: visible }, renderer_util_1.renderChildren(horizontalLayout.elements, schema, 'horizontal-layout-item', path)));
    };
    return HorizontalLayoutRenderer;
}(renderer_1.Renderer));
exports.HorizontalLayoutRenderer = HorizontalLayoutRenderer;
exports.default = renderer_util_1.registerStartupRenderer(exports.horizontalLayoutTester, inferno_redux_1.connect(renderer_util_1.mapStateToLayoutProps)(HorizontalLayoutRenderer));
//# sourceMappingURL=horizontal.layout.js.map