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
 * Default tester for a vertical layout.
 * @type {RankedTester}
 */
exports.verticalLayoutTester = testers_1.rankWith(1, testers_1.uiTypeIs('VerticalLayout'));
var VerticalLayoutRenderer = /** @class */ (function (_super) {
    __extends(VerticalLayoutRenderer, _super);
    function VerticalLayoutRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @inheritDoc
     */
    VerticalLayoutRenderer.prototype.render = function () {
        var _a = this.props, schema = _a.schema, uischema = _a.uischema, path = _a.path, visible = _a.visible;
        var verticalLayout = uischema;
        return (JSX_1.JSX.createElement(renderer_util_1.JsonFormsLayout, { styleName: 'vertical-layout', visible: visible }, renderer_util_1.renderChildren(verticalLayout.elements, schema, 'vertical-layout-item', path)));
    };
    return VerticalLayoutRenderer;
}(renderer_1.Renderer));
exports.VerticalLayoutRenderer = VerticalLayoutRenderer;
exports.default = renderer_util_1.registerStartupRenderer(exports.verticalLayoutTester, inferno_redux_1.connect(renderer_util_1.mapStateToLayoutProps)(VerticalLayoutRenderer));
//# sourceMappingURL=vertical.layout.js.map