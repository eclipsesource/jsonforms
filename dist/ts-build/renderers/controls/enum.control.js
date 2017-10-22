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
var base_control_1 = require("./base.control");
var inferno_redux_1 = require("inferno-redux");
var actions_1 = require("../../actions");
var renderer_util_1 = require("../renderer.util");
/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
exports.enumControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaMatches(function (schema) { return schema.hasOwnProperty('enum'); })));
var EnumControl = /** @class */ (function (_super) {
    __extends(EnumControl, _super);
    function EnumControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.valueProperty = 'value';
        return _this;
    }
    EnumControl.prototype.createInputElement = function () {
        var _this = this;
        var _a = this.props, uischema = _a.uischema, schema = _a.schema, visible = _a.visible, enabled = _a.enabled, data = _a.data, dispatch = _a.dispatch, path = _a.path;
        var isHidden = !visible;
        var isDisabled = !enabled;
        var options = path_util_1.resolveSchema(schema, uischema.scope.$ref).enum;
        return (JSX_1.JSX.createElement("select", { hidden: isHidden, disabled: isDisabled, value: data, onInput: function (ev) {
                dispatch(actions_1.update(path, function () { return _this.getInputValue(ev.target); }));
            } }, [JSX_1.JSX.createElement("option", { value: '' })].concat(options.map(function (optionValue) {
            return (JSX_1.JSX.createElement("option", { value: optionValue, label: optionValue, selected: data === optionValue }, optionValue));
        }))));
    };
    Object.defineProperty(EnumControl.prototype, "inputChangeProperty", {
        /**
         * @inheritDoc
         */
        get: function () {
            return 'onchange';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EnumControl.prototype.toInput = function (value) {
        return (value === undefined || value === null) ? undefined : value;
    };
    return EnumControl;
}(base_control_1.BaseControl));
exports.EnumControl = EnumControl;
exports.default = renderer_util_1.registerStartupRenderer(exports.enumControlTester, inferno_redux_1.connect(base_control_1.mapStateToControlProps)(EnumControl));
//# sourceMappingURL=enum.control.js.map