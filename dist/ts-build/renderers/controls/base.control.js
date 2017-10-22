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
var _ = require("lodash");
var renderer_util_1 = require("../renderer.util");
var label_util_1 = require("../label.util");
var renderer_1 = require("../../core/renderer");
var path_util_1 = require("../../path.util");
var actions_1 = require("../../actions");
var index_1 = require("../../reducers/index");
var validation_1 = require("../../reducers/validation");
/**
 * Convenience base class for all renderers that represent controls.
 */
// TODO: remove HTMLElement reference
var BaseControl = /** @class */ (function (_super) {
    __extends(BaseControl, _super);
    function BaseControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @inheritDoc
     */
    BaseControl.prototype.render = function () {
        var _a = this.props, uischema = _a.uischema, labelText = _a.labelText, errors = _a.errors;
        var controlElement = uischema;
        var isValid = _.isEmpty(errors);
        var classes = !_.isEmpty(controlElement.scope) ?
            []
                .concat(["control " + renderer_1.convertToClassName(controlElement.scope.$ref)])
                .concat([isValid ? 'valid' : 'invalid'])
            : [''];
        var controlId = _.has(controlElement.scope, 'ref') ? controlElement.scope.$ref : '';
        return (JSX_1.JSX.createElement(renderer_util_1.JsonFormsControl, { classes: classes.join(' '), controlId: controlId, labelText: labelText, validationErrors: errors }, this.createInputElement()));
    };
    /**
     * Convert the given value before setting it.
     * By default, this just resembles the identify function.
     *
     * @param {any} value the value that may need to be converted
     * @return {any} the converted value
     */
    BaseControl.prototype.toInput = function (value) {
        return value;
    };
    /**
     * Convert the given value before displaying it.
     * By default, this just resembles the identify function.
     *
     * @param {any} value the value that may need to be converted
     * @return {any} the converted value
     */
    BaseControl.prototype.toModel = function (value) {
        return value;
    };
    BaseControl.prototype.createProps = function (classNames, additionalProps) {
        var _this = this;
        if (classNames === void 0) { classNames = []; }
        if (additionalProps === void 0) { additionalProps = {}; }
        var _a = this.props, uischema = _a.uischema, data = _a.data, dispatch = _a.dispatch, visible = _a.visible, enabled = _a.enabled;
        var controlElement = uischema;
        var isHidden = !visible;
        var isDisabled = !enabled;
        var props = {
            className: ['validate'].concat(classNames),
            id: controlElement.scope.$ref,
            hidden: isHidden,
            disabled: isDisabled,
        };
        props[this.valueProperty] = data;
        props[this.inputChangeProperty] = function (ev) {
            dispatch(actions_1.update(_this.props.path, function () { return _this.getInputValue(ev.target); }));
        };
        return _.merge(props, additionalProps);
    };
    BaseControl.prototype.getInputValue = function (input) {
        return this.toModel(input[this.valueProperty]);
    };
    return BaseControl;
}(renderer_1.Renderer));
exports.BaseControl = BaseControl;
exports.mapStateToControlProps = function (state, ownProps) {
    var path = path_util_1.composeWithUi(ownProps.uischema, ownProps.path);
    var visible = _.has(ownProps, 'visible') ? ownProps.visible : renderer_1.isVisible(ownProps, state);
    var enabled = _.has(ownProps, 'enabled') ? ownProps.enabled : renderer_1.isEnabled(ownProps, state);
    var labelObject = label_util_1.getElementLabelObject(ownProps.schema, ownProps.uischema);
    var labelText = labelObject.show ? labelObject.text : '';
    return {
        data: path_util_1.resolveData(index_1.getData(state), path),
        errors: validation_1.errorAt(path)(index_1.getValidation(state)).map(function (error) { return error.message; }),
        labelText: labelText,
        visible: visible,
        enabled: enabled,
        path: path
    };
};
//# sourceMappingURL=base.control.js.map