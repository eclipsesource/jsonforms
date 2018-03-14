"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSX_1 = require("../JSX");
var testers_1 = require("../../core/testers");
var renderer_util_1 = require("../renderer.util");
var binding_1 = require("../../common/binding");
/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
exports.horizontalLayoutTester = testers_1.rankWith(1, testers_1.uiTypeIs('HorizontalLayout'));
exports.HorizontalLayoutRenderer = function (_a) {
    var schema = _a.schema, uischema = _a.uischema, path = _a.path, visible = _a.visible;
    var horizontalLayout = uischema;
    return (JSX_1.JSX.createElement(renderer_util_1.JsonFormsLayout, { styleName: 'horizontal-layout', visible: visible }, renderer_util_1.renderChildren(horizontalLayout.elements, schema, 'horizontal-layout-item', path)));
};
exports.default = renderer_util_1.registerStartupRenderer(exports.horizontalLayoutTester, binding_1.connect(renderer_util_1.mapStateToLayoutProps)(exports.HorizontalLayoutRenderer));
//# sourceMappingURL=horizontal.layout.js.map