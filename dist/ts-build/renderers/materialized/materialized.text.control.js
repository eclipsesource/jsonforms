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
var path_util_1 = require("../../path.util");
var renderer_util_1 = require("../renderer.util");
var text_control_1 = require("../controls/text.control");
var binding_1 = require("../../common/binding");
var MaterializedTextControl = /** @class */ (function (_super) {
    __extends(MaterializedTextControl, _super);
    function MaterializedTextControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MaterializedTextControl.prototype.componentDidMount = function () {
        var _a = this.props, id = _a.id, uischema = _a.uischema, schema = _a.schema;
        var controlElement = uischema;
        var maxLength = path_util_1.resolveSchema(schema, controlElement.scope.$ref).maxLength;
        if (uischema.options && uischema.options.trim && maxLength !== undefined) {
            var input = $("[id=\"" + id + "\"]");
            var fontSize = parseFloat(input.css('font-size'));
            /**
             * The widest letter of the latin alphabet is W and has a width of
             * widestLetterWidth when displayed with a font-size of baseFontSize.
             * Needed for the calculation of the input's width.
             * @type {number}
             */
            var widestLetterWidth = 15;
            /**
             * Base font size at which the letter W has a width of widestLetterWidth.
             * Needed for taking the current font-size of the input into account
             * when calculating the input's width.
             * @type {number}
             */
            var baseFontSize = 14.5;
            /*
               For the calculation of the input's width, the maximum number of allowed characters
               (maxLength) has to be multiplied by widestLetterWidth, as an input text consisting
               of W only can be assumed to be the widest input text possible.
               Furthermore, the result of this has to be multiplied by the ratio with which the
               font-size has increased (decreased) compared to the baseFontSize that applies to
               the mentioned widestLetterWidth for a W, in order to enlarge (shrink) the input
               width according to the changed font-size.
             */
            input.css('width', (maxLength * widestLetterWidth) * (fontSize / baseFontSize) + "px");
            // work-around of https://github.com/Dogfalo/materialize/issues/5408
            $("[id=\"" + id + "-parent\"]").css('text-align', 'initial');
        }
    };
    MaterializedTextControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, classNames = _a.classNames, id = _a.id, visible = _a.visible, enabled = _a.enabled, errors = _a.errors, label = _a.label, uischema = _a.uischema, schema = _a.schema, required = _a.required;
        var controlElement = uischema;
        var maxLength = path_util_1.resolveSchema(schema, controlElement.scope.$ref).maxLength;
        return (JSX_1.JSX.createElement("div", { className: classNames.wrapper, id: id + '-parent' },
            JSX_1.JSX.createElement("input", { value: this.state.value, onChange: function (ev) {
                    return _this.handleChange(ev.currentTarget.value);
                }, className: classNames.input, id: id, hidden: !visible, disabled: !enabled, autoFocus: uischema.options && uischema.options.focus, maxlength: uischema.options && uischema.options.restrict ? maxLength : undefined }),
            JSX_1.JSX.createElement("label", { htmlFor: id, className: classNames.label, "data-error": errors }, renderer_util_1.computeLabel(label, required))));
    };
    return MaterializedTextControl;
}(Control_1.Control));
exports.MaterializedTextControl = MaterializedTextControl;
exports.default = renderer_util_1.registerStartupRenderer(testers_1.withIncreasedRank(1, text_control_1.textControlTester), binding_1.connect(renderer_util_1.mapStateToControlProps)(MaterializedTextControl));
//# sourceMappingURL=materialized.text.control.js.map