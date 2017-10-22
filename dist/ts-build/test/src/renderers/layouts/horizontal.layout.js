"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../JSX");
const renderer_1 = require("../../core/renderer");
const testers_1 = require("../../core/testers");
const renderer_util_1 = require("../renderer.util");
const inferno_redux_1 = require("inferno-redux");
/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
exports.horizontalLayoutTester = testers_1.rankWith(1, testers_1.uiTypeIs('HorizontalLayout'));
class HorizontalLayoutRenderer extends renderer_1.Renderer {
    /**
     * @inheritDoc
     */
    render() {
        const { schema, uischema, path, visible } = this.props;
        const horizontalLayout = uischema;
        return (JSX_1.JSX.createElement(renderer_util_1.JsonFormsLayout, { styleName: 'horizontal-layout', visible: visible }, renderer_util_1.renderChildren(horizontalLayout.elements, schema, 'horizontal-layout-item', path)));
    }
}
exports.HorizontalLayoutRenderer = HorizontalLayoutRenderer;
exports.default = renderer_util_1.registerStartupRenderer(exports.horizontalLayoutTester, inferno_redux_1.connect(renderer_util_1.mapStateToLayoutProps)(HorizontalLayoutRenderer));
//# sourceMappingURL=horizontal.layout.js.map