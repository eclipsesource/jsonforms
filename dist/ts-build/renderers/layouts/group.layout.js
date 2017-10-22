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
var _ = require("lodash");
var core_1 = require("../../core");
var renderer_1 = require("../../core/renderer");
var testers_1 = require("../../core/testers");
var renderer_util_1 = require("../renderer.util");
var inferno_redux_1 = require("inferno-redux");
/**
 * Default tester for a group layout.
 *
 * @type {RankedTester}
 */
exports.groupTester = testers_1.rankWith(1, testers_1.uiTypeIs('Group'));
var GroupLayoutRenderer = /** @class */ (function (_super) {
    __extends(GroupLayoutRenderer, _super);
    function GroupLayoutRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupLayoutRenderer.prototype.render = function () {
        var _a = this.props, schema = _a.schema, uischema = _a.uischema, path = _a.path, visible = _a.visible;
        var group = uischema;
        return (JSX_1.JSX.createElement(renderer_util_1.JsonFormsLayout, { styleName: 'group-layout', visible: visible },
            !_.isEmpty(group.label) ?
                JSX_1.JSX.createElement("legend", { className: core_1.JsonForms.stylingRegistry.getAsClassName('group.label') }, group.label) : '',
            renderer_util_1.renderChildren(group.elements, schema, 'group-layout-item', path)));
    };
    return GroupLayoutRenderer;
}(renderer_1.Renderer));
exports.GroupLayoutRenderer = GroupLayoutRenderer;
exports.default = renderer_util_1.registerStartupRenderer(exports.groupTester, inferno_redux_1.connect(renderer_util_1.mapStateToLayoutProps)(GroupLayoutRenderer));
//# sourceMappingURL=group.layout.js.map