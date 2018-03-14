"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSX_1 = require("../JSX");
var testers_1 = require("../../core/testers");
var renderer_util_1 = require("../renderer.util");
var binding_1 = require("../../common/binding");
/**
 * Default tester for a vertical layout.
 * @type {RankedTester}
 */
exports.verticalLayoutTester = testers_1.rankWith(1, testers_1.uiTypeIs('VerticalLayout'));
exports.VerticalLayoutRenderer = function (_a) {
    var schema = _a.schema, uischema = _a.uischema, path = _a.path, visible = _a.visible;
    var verticalLayout = uischema;
    return (JSX_1.JSX.createElement(renderer_util_1.JsonFormsLayout, { styleName: 'vertical-layout', visible: visible }, renderer_util_1.renderChildren(verticalLayout.elements, schema, 'vertical-layout-item', path)));
};
exports.default = renderer_util_1.registerStartupRenderer(exports.verticalLayoutTester, binding_1.connect(renderer_util_1.mapStateToLayoutProps)(exports.VerticalLayoutRenderer));
//# sourceMappingURL=vertical.layout.js.map