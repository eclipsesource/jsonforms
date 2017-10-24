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
var testers_1 = require("../../core/testers");
var inferno_redux_1 = require("inferno-redux");
var Control_1 = require("../controls/Control");
var renderer_util_1 = require("../renderer.util");
var integer_control_1 = require("../controls/integer.control");
var IntegerControl = /** @class */ (function (_super) {
    __extends(IntegerControl, _super);
    function IntegerControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntegerControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, data = _a.data, classNames = _a.classNames, id = _a.id, visible = _a.visible, enabled = _a.enabled, errors = _a.errors, label = _a.label;
        return (JSX_1.JSX.createElement("div", { className: classNames.wrapper },
            JSX_1.JSX.createElement("label", { for: id, className: classNames.label, "data-error": errors }, label),
            JSX_1.JSX.createElement("input", { type: 'number', step: '1', value: data, onInput: function (ev) { return _this.updateData(_.toInteger(ev.target.value)); }, className: classNames.input, id: id, hidden: !visible, disabled: !enabled })));
    };
    return IntegerControl;
}(Control_1.Control));
exports.IntegerControl = IntegerControl;
exports.default = renderer_util_1.registerStartupRenderer(testers_1.withIncreasedRank(1, integer_control_1.integerControlTester), inferno_redux_1.connect(renderer_util_1.mapStateToControlProps)(IntegerControl));
//# sourceMappingURL=materialized.integer.control.js.map