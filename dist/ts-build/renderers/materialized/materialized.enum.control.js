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
var path_util_1 = require("../../path.util");
var inferno_redux_1 = require("inferno-redux");
var Control_1 = require("../controls/Control");
var renderer_util_1 = require("../renderer.util");
var enum_control_1 = require("../controls/enum.control");
var EnumControl = /** @class */ (function (_super) {
    __extends(EnumControl, _super);
    function EnumControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnumControl.prototype.componentDidMount = function () {
        $('select').material_select();
    };
    EnumControl.prototype.componentDidUpdate = function () {
        $('select').material_select();
    };
    EnumControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, uischema = _a.uischema, schema = _a.schema, classNames = _a.classNames, id = _a.id, label = _a.label, visible = _a.visible, enabled = _a.enabled, data = _a.data, errors = _a.errors;
        var options = path_util_1.resolveSchema(schema, uischema.scope.$ref).enum;
        return (JSX_1.JSX.createElement("div", { className: classNames.wrapper, hidden: !visible },
            JSX_1.JSX.createElement("select", { className: classNames.input, disabled: !enabled, value: data, onChange: function (ev) { return _this.updateData(ev.target.value); } }, [JSX_1.JSX.createElement("option", { value: '', selected: data === undefined })]
                .concat(options.map(function (optionValue) {
                return (JSX_1.JSX.createElement("option", { value: optionValue, label: optionValue, selected: data === optionValue }, optionValue));
            }))),
            JSX_1.JSX.createElement("label", { for: id, "data-error": errors }, label)));
    };
    return EnumControl;
}(Control_1.Control));
exports.EnumControl = EnumControl;
exports.default = renderer_util_1.registerStartupRenderer(testers_1.withIncreasedRank(1, enum_control_1.enumControlTester), inferno_redux_1.connect(renderer_util_1.mapStateToControlProps)(EnumControl));
//# sourceMappingURL=materialized.enum.control.js.map