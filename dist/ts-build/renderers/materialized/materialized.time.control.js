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
var time_control_1 = require("../controls/time.control");
var binding_1 = require("../../common/binding");
var TimeControl = /** @class */ (function (_super) {
    __extends(TimeControl, _super);
    function TimeControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeControl.prototype.componentDidMount = function () {
        $('.timepicker').pickatime({
            default: 'now',
            fromnow: 0,
            twelvehour: false,
            donetext: 'OK',
            cleartext: 'Clear',
            canceltext: 'Cancel',
            autoclose: false,
            ampmclickable: true // make AM PM clickable
        });
    };
    TimeControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, classNames = _a.classNames, id = _a.id, visible = _a.visible, enabled = _a.enabled, errors = _a.errors, label = _a.label, uischema = _a.uischema;
        classNames.input += ' timepicker';
        var fixedId = '\'' + id + '\''; // because label[for=#/properties/time] is erroneous
        return (JSX_1.JSX.createElement("div", { className: classNames.wrapper },
            JSX_1.JSX.createElement("label", { htmlFor: fixedId, className: classNames.label, "data-error": errors }, label),
            JSX_1.JSX.createElement("input", { type: 'text', value: this.state.value, onChange: function (ev) { return _this.handleChange(ev.target.value); }, className: classNames.input, id: fixedId, hidden: !visible, disabled: !enabled, autoFocus: uischema.options && uischema.options.focus })));
    };
    return TimeControl;
}(Control_1.Control));
exports.TimeControl = TimeControl;
exports.default = renderer_util_1.registerStartupRenderer(testers_1.withIncreasedRank(1, time_control_1.timeControlTester), binding_1.connect(renderer_util_1.mapStateToControlProps)(TimeControl));
//# sourceMappingURL=materialized.time.control.js.map