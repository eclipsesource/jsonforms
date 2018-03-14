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
var path_util_1 = require("../../path.util");
var renderer_util_1 = require("../renderer.util");
var binding_1 = require("../../common/binding");
/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
exports.textControlTester = testers_1.rankWith(1, testers_1.isControl);
var TextControl = /** @class */ (function (_super) {
    __extends(TextControl, _super);
    function TextControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, classNames = _a.classNames, id = _a.id, visible = _a.visible, enabled = _a.enabled, errors = _a.errors, label = _a.label, uischema = _a.uischema, schema = _a.schema, required = _a.required;
        var isValid = errors.length === 0;
        var divClassNames = 'validation' + (isValid ? '' : ' validation_error');
        var controlElement = uischema;
        var maxLength = path_util_1.resolveSchema(schema, controlElement.scope.$ref).maxLength;
        return (JSX_1.JSX.createElement("div", { className: classNames.wrapper },
            JSX_1.JSX.createElement("label", { htmlFor: id, className: classNames.label }, renderer_util_1.computeLabel(label, required)),
            JSX_1.JSX.createElement("input", { value: this.state.value, onChange: function (ev) {
                    return _this.handleChange(ev.currentTarget.value);
                }, className: classNames.input, id: id, hidden: !visible, disabled: !enabled, autoFocus: uischema.options && uischema.options.focus, maxlength: uischema.options && uischema.options.restrict ? maxLength : undefined, size: uischema.options && uischema.options.trim ? maxLength : undefined }),
            JSX_1.JSX.createElement("div", { className: divClassNames }, !isValid ? renderer_util_1.formatErrorMessage(errors) : '')));
    };
    return TextControl;
}(Control_1.Control));
exports.TextControl = TextControl;
exports.default = renderer_util_1.registerStartupRenderer(exports.textControlTester, binding_1.connect(renderer_util_1.mapStateToControlProps)(TextControl));
//# sourceMappingURL=text.control.js.map