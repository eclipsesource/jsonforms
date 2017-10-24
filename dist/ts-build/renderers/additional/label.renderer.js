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
var inferno_redux_1 = require("inferno-redux");
var _ = require("lodash");
var renderer_1 = require("../../core/renderer");
var testers_1 = require("../../core/testers");
var core_1 = require("../../core");
var renderer_util_1 = require("../renderer.util");
/**
 * Default tester for a label.
 * @type {RankedTester}
 */
exports.labelRendererTester = testers_1.rankWith(1, testers_1.uiTypeIs('Label'));
/**
 * Default renderer for a label.
 */
var LabelRenderer = /** @class */ (function (_super) {
    __extends(LabelRenderer, _super);
    function LabelRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @inheritDoc
     */
    LabelRenderer.prototype.render = function () {
        var _a = this.props, uischema = _a.uischema, visible = _a.visible;
        var labelElement = uischema;
        var classNames = [core_1.JsonForms.stylingRegistry.getAsClassName('label-control')];
        var isHidden = !visible;
        return (JSX_1.JSX.createElement("label", { hidden: isHidden, className: classNames }, labelElement.text !== undefined && labelElement.text !== null ?
            labelElement.text : ''));
    };
    return LabelRenderer;
}(renderer_1.Renderer));
exports.LabelRenderer = LabelRenderer;
var mapStateToProps = function (state, ownProps) {
    var visible = _.has(ownProps, 'visible') ? ownProps.visible : renderer_1.isVisible(ownProps, state);
    return {
        visible: visible
    };
};
exports.default = renderer_util_1.registerStartupRenderer(exports.labelRendererTester, inferno_redux_1.connect(mapStateToProps)(LabelRenderer));
//# sourceMappingURL=label.renderer.js.map