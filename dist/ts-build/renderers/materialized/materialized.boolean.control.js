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
var testers_1 = require("../../core/testers");
var inferno_redux_1 = require("inferno-redux");
var Control_1 = require("../controls/Control");
var renderer_util_1 = require("../renderer.util");
var boolean_control_1 = require("../controls/boolean.control");
var BooleanControl = /** @class */ (function (_super) {
    __extends(BooleanControl, _super);
    function BooleanControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BooleanControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, data = _a.data, classNames = _a.classNames, id = _a.id, visible = _a.visible, enabled = _a.enabled, errors = _a.errors, label = _a.label;
        var className = classNames.wrapper.replace('input-field', '');
        return (JSX_1.JSX.createElement("div", { className: className },
            JSX_1.JSX.createElement("input", { type: 'checkbox', checked: data, onClick: function (ev) { return _this.updateData(ev.target.checked); }, className: classNames.input, id: id, hidden: !visible, disabled: !enabled }),
            JSX_1.JSX.createElement("label", { for: id, className: classNames.label, "data-error": errors }, label)));
    };
    return BooleanControl;
}(Control_1.Control));
exports.BooleanControl = BooleanControl;
exports.default = renderer_util_1.registerStartupRenderer(testers_1.withIncreasedRank(1, boolean_control_1.booleanControlTester), inferno_redux_1.connect(renderer_util_1.mapStateToControlProps)(BooleanControl));
//# sourceMappingURL=materialized.boolean.control.js.map