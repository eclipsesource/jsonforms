"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../JSX");
const renderer_1 = require("../../core/renderer");
const testers_1 = require("../../core/testers");
const renderer_util_1 = require("../renderer.util");
const inferno_redux_1 = require("inferno-redux");
/**
 * Default tester for a vertical layout.
 * @type {RankedTester}
 */
exports.verticalLayoutTester = testers_1.rankWith(1, testers_1.uiTypeIs('VerticalLayout'));
class VerticalLayoutRenderer extends renderer_1.Renderer {
    /**
     * @inheritDoc
     */
    render() {
        const { schema, uischema, path, visible } = this.props;
        const verticalLayout = uischema;
        return (JSX_1.JSX.createElement(renderer_util_1.JsonFormsLayout, { styleName: 'vertical-layout', visible: visible }, renderer_util_1.renderChildren(verticalLayout.elements, schema, 'vertical-layout-item', path)));
    }
}
exports.VerticalLayoutRenderer = VerticalLayoutRenderer;
exports.default = renderer_util_1.registerStartupRenderer(exports.verticalLayoutTester, inferno_redux_1.connect(renderer_util_1.mapStateToLayoutProps)(VerticalLayoutRenderer));
//# sourceMappingURL=vertical.layout.js.map