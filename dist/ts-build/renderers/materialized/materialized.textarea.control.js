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
var textarea_control_1 = require("../controls/textarea.control");
var binding_1 = require("../../common/binding");
var MaterializedTextareaControl = /** @class */ (function (_super) {
    __extends(MaterializedTextareaControl, _super);
    function MaterializedTextareaControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MaterializedTextareaControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, classNames = _a.classNames, id = _a.id, visible = _a.visible, enabled = _a.enabled, errors = _a.errors, label = _a.label, uischema = _a.uischema, required = _a.required;
        classNames.input += ' materialize-textarea';
        return (JSX_1.JSX.createElement("div", { className: classNames.wrapper },
            JSX_1.JSX.createElement("label", { htmlFor: id, className: classNames.label, "data-error": errors }, renderer_util_1.computeLabel(label, required)),
            JSX_1.JSX.createElement("textarea", { value: this.state.value, onChange: function (ev) {
                    return _this.handleChange(ev.currentTarget.value);
                }, className: classNames.input, id: id, hidden: !visible, disabled: !enabled, autoFocus: uischema.options && uischema.options.focus })));
    };
    return MaterializedTextareaControl;
}(Control_1.Control));
exports.MaterializedTextareaControl = MaterializedTextareaControl;
exports.default = renderer_util_1.registerStartupRenderer(testers_1.withIncreasedRank(1, textarea_control_1.textAreaControlTester), binding_1.connect(renderer_util_1.mapStateToControlProps)(MaterializedTextareaControl));
//# sourceMappingURL=materialized.textarea.control.js.map