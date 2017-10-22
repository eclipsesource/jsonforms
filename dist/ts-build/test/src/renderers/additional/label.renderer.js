"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../JSX");
const inferno_redux_1 = require("inferno-redux");
const _ = require("lodash");
const renderer_1 = require("../../core/renderer");
const testers_1 = require("../../core/testers");
const core_1 = require("../../core");
const renderer_util_1 = require("../renderer.util");
/**
 * Default tester for a label.
 * @type {RankedTester}
 */
exports.labelRendererTester = testers_1.rankWith(1, testers_1.uiTypeIs('Label'));
/**
 * Default renderer for a label.
 */
class LabelRenderer extends renderer_1.Renderer {
    /**
     * @inheritDoc
     */
    render() {
        const { uischema, visible } = this.props;
        const labelElement = uischema;
        const classNames = [core_1.JsonForms.stylingRegistry.getAsClassName('label-control')];
        const isHidden = !visible;
        return (JSX_1.JSX.createElement("label", { hidden: isHidden, className: classNames }, labelElement.text !== undefined && labelElement.text !== null ?
            labelElement.text : ''));
    }
}
exports.LabelRenderer = LabelRenderer;
const mapStateToProps = (state, ownProps) => {
    const visible = _.has(ownProps, 'visible') ? ownProps.visible : renderer_1.isVisible(ownProps, state);
    return {
        visible
    };
};
exports.default = renderer_util_1.registerStartupRenderer(exports.labelRendererTester, inferno_redux_1.connect(mapStateToProps)(LabelRenderer));
//# sourceMappingURL=label.renderer.js.map