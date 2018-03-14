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
var Control_1 = require("./Control");
var renderer_util_1 = require("../renderer.util");
var binding_1 = require("../../common/binding");
/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
exports.booleanControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaTypeIs('boolean')));
var BooleanControl = /** @class */ (function (_super) {
    __extends(BooleanControl, _super);
    function BooleanControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BooleanControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, classNames = _a.classNames, id = _a.id, visible = _a.visible, enabled = _a.enabled, errors = _a.errors, label = _a.label, uischema = _a.uischema;
        var isValid = errors.length === 0;
        var divClassNames = 'validation' + (isValid ? '' : ' validation_error');
        return (JSX_1.JSX.createElement("div", { className: classNames.wrapper },
            JSX_1.JSX.createElement("label", { htmlFor: id, className: classNames.label, "data-error": errors }, label),
            JSX_1.JSX.createElement("input", { type: 'checkbox', checked: this.state.value, onChange: function (ev) {
                    return _this.handleChange(ev.currentTarget.checked);
                }, className: classNames.input, id: id, hidden: !visible, disabled: !enabled, autoFocus: uischema.options && uischema.options.focus }),
            JSX_1.JSX.createElement("div", { className: divClassNames }, !isValid ? renderer_util_1.formatErrorMessage(errors) : '')));
    };
    return BooleanControl;
}(Control_1.Control));
exports.BooleanControl = BooleanControl;
exports.default = renderer_util_1.registerStartupRenderer(exports.booleanControlTester, binding_1.connect(renderer_util_1.mapStateToControlProps)(BooleanControl));
//# sourceMappingURL=boolean.control.js.map