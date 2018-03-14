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
var Control_1 = require("../controls/Control");
var renderer_util_1 = require("../renderer.util");
var date_control_1 = require("../controls/date.control");
var binding_1 = require("../../common/binding");
var DateControl = /** @class */ (function (_super) {
    __extends(DateControl, _super);
    function DateControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateControl.prototype.componentDidMount = function () {
        $('.datepicker').pickadate({
            format: 'yyyy-mm-dd',
            selectMonths: true,
            selectYears: 15,
            today: 'Today',
            clear: 'Clear',
            close: 'Ok',
            closeOnSelect: false // Close upon selecting a date,
        });
    };
    DateControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, classNames = _a.classNames, id = _a.id, visible = _a.visible, enabled = _a.enabled, errors = _a.errors, label = _a.label, uischema = _a.uischema, required = _a.required;
        classNames.input += ' datepicker';
        return (JSX_1.JSX.createElement("div", { className: classNames.wrapper },
            JSX_1.JSX.createElement("label", { htmlFor: id, className: classNames.label, "data-error": errors }, renderer_util_1.computeLabel(label, required)),
            JSX_1.JSX.createElement("input", { type: 'text', value: this.state.value, onChange: function (ev) { return _this.handleChange(ev.target.value); }, className: classNames.input, id: id, hidden: !visible, disabled: !enabled, autoFocus: uischema.options && uischema.options.focus })));
    };
    return DateControl;
}(Control_1.Control));
exports.DateControl = DateControl;
exports.default = renderer_util_1.registerStartupRenderer(testers_1.withIncreasedRank(1, date_control_1.dateControlTester), binding_1.connect(renderer_util_1.mapStateToControlProps)(DateControl));
//# sourceMappingURL=materialized.date.control.js.map