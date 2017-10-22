"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../JSX");
const _ = require("lodash");
const renderer_util_1 = require("../renderer.util");
const label_util_1 = require("../label.util");
const renderer_1 = require("../../core/renderer");
const path_util_1 = require("../../path.util");
const actions_1 = require("../../actions");
const index_1 = require("../../reducers/index");
const validation_1 = require("../../reducers/validation");
/**
 * Convenience base class for all renderers that represent controls.
 */
// TODO: remove HTMLElement reference
class BaseControl extends renderer_1.Renderer {
    /**
     * @inheritDoc
     */
    render() {
        const { uischema, labelText, errors } = this.props;
        const controlElement = uischema;
        const isValid = _.isEmpty(errors);
        const classes = !_.isEmpty(controlElement.scope) ?
            []
                .concat([`control ${renderer_1.convertToClassName(controlElement.scope.$ref)}`])
                .concat([isValid ? 'valid' : 'invalid'])
            : [''];
        const controlId = _.has(controlElement.scope, 'ref') ? controlElement.scope.$ref : '';
        return (JSX_1.JSX.createElement(renderer_util_1.JsonFormsControl, { classes: classes.join(' '), controlId: controlId, labelText: labelText, validationErrors: errors }, this.createInputElement()));
    }
    /**
     * Convert the given value before setting it.
     * By default, this just resembles the identify function.
     *
     * @param {any} value the value that may need to be converted
     * @return {any} the converted value
     */
    toInput(value) {
        return value;
    }
    /**
     * Convert the given value before displaying it.
     * By default, this just resembles the identify function.
     *
     * @param {any} value the value that may need to be converted
     * @return {any} the converted value
     */
    toModel(value) {
        return value;
    }
    createProps(classNames = [], additionalProps = {}) {
        const { uischema, data, dispatch, visible, enabled } = this.props;
        const controlElement = uischema;
        const isHidden = !visible;
        const isDisabled = !enabled;
        const props = {
            className: ['validate'].concat(classNames),
            id: controlElement.scope.$ref,
            hidden: isHidden,
            disabled: isDisabled,
        };
        props[this.valueProperty] = data;
        props[this.inputChangeProperty] = ev => {
            dispatch(actions_1.update(this.props.path, () => this.getInputValue(ev.target)));
        };
        return _.merge(props, additionalProps);
    }
    getInputValue(input) {
        return this.toModel(input[this.valueProperty]);
    }
}
exports.BaseControl = BaseControl;
exports.mapStateToControlProps = (state, ownProps) => {
    const path = path_util_1.composeWithUi(ownProps.uischema, ownProps.path);
    const visible = _.has(ownProps, 'visible') ? ownProps.visible : renderer_1.isVisible(ownProps, state);
    const enabled = _.has(ownProps, 'enabled') ? ownProps.enabled : renderer_1.isEnabled(ownProps, state);
    const labelObject = label_util_1.getElementLabelObject(ownProps.schema, ownProps.uischema);
    const labelText = labelObject.show ? labelObject.text : '';
    return {
        data: path_util_1.resolveData(index_1.getData(state), path),
        errors: validation_1.errorAt(path)(index_1.getValidation(state)).map(error => error.message),
        labelText,
        visible,
        enabled,
        path
    };
};
//# sourceMappingURL=base.control.js.map