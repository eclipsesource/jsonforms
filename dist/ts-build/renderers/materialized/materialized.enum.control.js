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
var Control_1 = require("../controls/Control");
var renderer_util_1 = require("../renderer.util");
var enum_control_1 = require("../controls/enum.control");
var binding_1 = require("../../common/binding");
var MaterializedEnumControl = /** @class */ (function (_super) {
    __extends(MaterializedEnumControl, _super);
    function MaterializedEnumControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MaterializedEnumControl.prototype.componentDidMount = function () {
        $('select').material_select();
    };
    MaterializedEnumControl.prototype.componentDidUpdate = function () {
        $('select').material_select();
    };
    MaterializedEnumControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, uischema = _a.uischema, schema = _a.schema, classNames = _a.classNames, id = _a.id, label = _a.label, visible = _a.visible, enabled = _a.enabled, data = _a.data, errors = _a.errors, required = _a.required;
        var options = path_util_1.resolveSchema(schema, uischema.scope.$ref).enum;
        return (JSX_1.JSX.createElement("div", { className: classNames.wrapper, hidden: !visible },
            JSX_1.JSX.createElement("select", { className: classNames.input, disabled: !enabled, value: this.state.value, onChange: function (ev) { return _this.handleChange(ev.target.value); } }, [JSX_1.JSX.createElement("option", { value: '', selected: data === undefined, key: 'empty' })]
                .concat(options.map(function (optionValue) {
                return (JSX_1.JSX.createElement("option", { value: optionValue, label: optionValue, selected: data === optionValue, key: optionValue }, optionValue));
            }))),
            JSX_1.JSX.createElement("label", { htmlFor: id, "data-error": errors }, renderer_util_1.computeLabel(label, required))));
    };
    return MaterializedEnumControl;
}(Control_1.Control));
exports.MaterializedEnumControl = MaterializedEnumControl;
exports.default = renderer_util_1.registerStartupRenderer(testers_1.withIncreasedRank(1, enum_control_1.enumControlTester), binding_1.connect(renderer_util_1.mapStateToControlProps)(MaterializedEnumControl));
//# sourceMappingURL=materialized.enum.control.js.map