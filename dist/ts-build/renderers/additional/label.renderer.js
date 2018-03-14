"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSX_1 = require("../JSX");
var _ = require("lodash");
var renderer_1 = require("../../core/renderer");
var testers_1 = require("../../core/testers");
var core_1 = require("../../core");
var renderer_util_1 = require("../renderer.util");
var binding_1 = require("../../common/binding");
/**
 * Default tester for a label.
 * @type {RankedTester}
 */
exports.labelRendererTester = testers_1.rankWith(1, testers_1.uiTypeIs('Label'));
/**
 * Default renderer for a label.
 */
exports.LabelRenderer = function (_a) {
    var uischema = _a.uischema, visible = _a.visible;
    var labelElement = uischema;
    var classNames = core_1.JsonForms.stylingRegistry.getAsClassName('label-control');
    var isHidden = !visible;
    return (JSX_1.JSX.createElement("label", { hidden: isHidden, className: classNames }, labelElement.text !== undefined && labelElement.text !== null && labelElement.text));
};
var mapStateToProps = function (state, ownProps) {
    var visible = _.has(ownProps, 'visible') ? ownProps.visible : renderer_1.isVisible(ownProps, state);
    return {
        visible: visible
    };
};
exports.default = renderer_util_1.registerStartupRenderer(exports.labelRendererTester, binding_1.connect(mapStateToProps, null)(exports.LabelRenderer));
//# sourceMappingURL=label.renderer.js.map