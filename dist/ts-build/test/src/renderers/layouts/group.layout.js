"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../JSX");
const _ = require("lodash");
const core_1 = require("../../core");
const renderer_1 = require("../../core/renderer");
const testers_1 = require("../../core/testers");
const renderer_util_1 = require("../renderer.util");
const inferno_redux_1 = require("inferno-redux");
/**
 * Default tester for a group layout.
 *
 * @type {RankedTester}
 */
exports.groupTester = testers_1.rankWith(1, testers_1.uiTypeIs('Group'));
class GroupLayoutRenderer extends renderer_1.Renderer {
    render() {
        const { schema, uischema, path, visible } = this.props;
        const group = uischema;
        return (JSX_1.JSX.createElement(renderer_util_1.JsonFormsLayout, { styleName: 'group-layout', visible: visible },
            !_.isEmpty(group.label) ?
                JSX_1.JSX.createElement("legend", { className: core_1.JsonForms.stylingRegistry.getAsClassName('group.label') }, group.label) : '',
            renderer_util_1.renderChildren(group.elements, schema, 'group-layout-item', path)));
    }
}
exports.GroupLayoutRenderer = GroupLayoutRenderer;
exports.default = renderer_util_1.registerStartupRenderer(exports.groupTester, inferno_redux_1.connect(renderer_util_1.mapStateToLayoutProps)(GroupLayoutRenderer));
//# sourceMappingURL=group.layout.js.map