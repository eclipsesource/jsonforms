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
var actions_1 = require("../../actions");
var binding_1 = require("../../common/binding");
var Control_1 = require("./Control");
var renderer_util_1 = require("../renderer.util");
/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
exports.enumControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaMatches(function (schema) { return schema.hasOwnProperty('enum'); })));
var EnumControl = /** @class */ (function (_super) {
    __extends(EnumControl, _super);
    function EnumControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnumControl.prototype.render = function () {
        var _a = this.props, uischema = _a.uischema, schema = _a.schema, classNames = _a.classNames, id = _a.id, label = _a.label, visible = _a.visible, enabled = _a.enabled, data = _a.data, path = _a.path, errors = _a.errors, dispatch = _a.dispatch, required = _a.required;
        var isValid = errors.length === 0;
        var options = path_util_1.resolveSchema(schema, uischema.scope.$ref).enum;
        var divClassNames = 'validation' + (isValid ? '' : ' validation_error');
        return (JSX_1.JSX.createElement("div", { className: classNames.wrapper },
            JSX_1.JSX.createElement("label", { htmlFor: id, className: classNames.label }, renderer_util_1.computeLabel(label, required)),
            JSX_1.JSX.createElement("select", { className: classNames.input, hidden: !visible, disabled: !enabled, value: this.state.value, onChange: function (ev) {
                    return dispatch(actions_1.update(path, function () { return ev.currentTarget.value; }));
                } }, [JSX_1.JSX.createElement("option", { value: '', selected: data === undefined })]
                .concat(options.map(function (optionValue) {
                return (JSX_1.JSX.createElement("option", { value: optionValue, label: optionValue, selected: data === optionValue, key: optionValue }, optionValue));
            }))),
            JSX_1.JSX.createElement("div", { className: divClassNames }, !isValid ? renderer_util_1.formatErrorMessage(errors) : '')));
    };
    return EnumControl;
}(Control_1.Control));
exports.EnumControl = EnumControl;
exports.default = renderer_util_1.registerStartupRenderer(exports.enumControlTester, binding_1.connect(renderer_util_1.mapStateToControlProps)(EnumControl));
//# sourceMappingURL=enum.control.js.map