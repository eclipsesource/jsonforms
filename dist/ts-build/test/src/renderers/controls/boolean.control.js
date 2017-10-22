"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../JSX");
const testers_1 = require("../../core/testers");
const base_control_1 = require("./base.control");
const inferno_redux_1 = require("inferno-redux");
const renderer_util_1 = require("../renderer.util");
/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
exports.booleanControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaTypeIs('boolean')));
class BooleanControl extends base_control_1.BaseControl {
    constructor() {
        super(...arguments);
        this.inputChangeProperty = 'onClick';
        this.valueProperty = 'checked';
    }
    createInputElement() {
        const props = this.createProps();
        props.checked = this.props.data;
        return JSX_1.JSX.createElement("input", Object.assign({ type: 'checkbox' }, props));
    }
}
exports.BooleanControl = BooleanControl;
exports.default = renderer_util_1.registerStartupRenderer(exports.booleanControlTester, inferno_redux_1.connect(base_control_1.mapStateToControlProps)(BooleanControl));
//# sourceMappingURL=boolean.control.js.map