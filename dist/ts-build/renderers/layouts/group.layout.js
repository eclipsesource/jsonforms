"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSX_1 = require("../JSX");
var _ = require("lodash");
var core_1 = require("../../core");
var testers_1 = require("../../core/testers");
var renderer_util_1 = require("../renderer.util");
var binding_1 = require("../../common/binding");
/**
 * Default tester for a group layout.
 *
 * @type {RankedTester}
 */
exports.groupTester = testers_1.rankWith(1, testers_1.uiTypeIs('Group'));
exports.GroupLayoutRenderer = function (_a) {
    var schema = _a.schema, uischema = _a.uischema, path = _a.path, visible = _a.visible;
    var group = uischema;
    var classNames = core_1.JsonForms.stylingRegistry.getAsClassName('group-layout');
    return (JSX_1.JSX.createElement("fieldset", { className: classNames, hidden: visible === undefined || visible === null ? false : !visible },
        !_.isEmpty(group.label) ?
            JSX_1.JSX.createElement("legend", { className: core_1.JsonForms.stylingRegistry.getAsClassName('group.label') }, group.label) : '',
        renderer_util_1.renderChildren(group.elements, schema, 'group-layout-item', path)));
};
exports.default = renderer_util_1.registerStartupRenderer(exports.groupTester, binding_1.connect(renderer_util_1.mapStateToLayoutProps)(exports.GroupLayoutRenderer));
//# sourceMappingURL=group.layout.js.map