"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../JSX");
const testers_1 = require("../../core/testers");
const path_util_1 = require("../../path.util");
const base_control_1 = require("./base.control");
const inferno_redux_1 = require("inferno-redux");
const actions_1 = require("../../actions");
const renderer_util_1 = require("../renderer.util");
/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
exports.enumControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaMatches(schema => schema.hasOwnProperty('enum'))));
class EnumControl extends base_control_1.BaseControl {
    constructor() {
        super(...arguments);
        this.valueProperty = 'value';
    }
    createInputElement() {
        const { uischema, schema, visible, enabled, data, dispatch, path } = this.props;
        const isHidden = !visible;
        const isDisabled = !enabled;
        const options = path_util_1.resolveSchema(schema, uischema.scope.$ref).enum;
        return (JSX_1.JSX.createElement("select", { hidden: isHidden, disabled: isDisabled, value: data, onInput: ev => {
                dispatch(actions_1.update(path, () => this.getInputValue(ev.target)));
            } }, [JSX_1.JSX.createElement("option", { value: '' })].concat(options.map(optionValue => {
            return (JSX_1.JSX.createElement("option", { value: optionValue, label: optionValue, selected: data === optionValue }, optionValue));
        }))));
    }
    /**
     * @inheritDoc
     */
    get inputChangeProperty() {
        return 'onchange';
    }
    /**
     * @inheritDoc
     */
    toInput(value) {
        return (value === undefined || value === null) ? undefined : value;
    }
}
exports.EnumControl = EnumControl;
exports.default = renderer_util_1.registerStartupRenderer(exports.enumControlTester, inferno_redux_1.connect(base_control_1.mapStateToControlProps)(EnumControl));
//# sourceMappingURL=enum.control.js.map