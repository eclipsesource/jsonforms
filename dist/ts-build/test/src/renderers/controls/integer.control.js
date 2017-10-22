"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../JSX");
const _ = require("lodash");
const testers_1 = require("../../core/testers");
const base_control_1 = require("./base.control");
const inferno_redux_1 = require("inferno-redux");
const renderer_util_1 = require("../renderer.util");
/**
 * Default tester for integer controls.
 * @type {RankedTester}
 */
exports.integerControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaTypeIs('integer')));
class IntegerControl extends base_control_1.BaseControl {
    constructor() {
        super(...arguments);
        this.inputChangeProperty = 'onInput';
        this.valueProperty = 'value';
    }
    /**
     * @inheritDoc
     */
    toModel(value) {
        return _.toInteger(value);
    }
    /**
     * @inheritDoc
     */
    createInputElement() {
        return (JSX_1.JSX.createElement("input", Object.assign({ type: 'number' }, this.createProps([], {
            step: 1
        }))));
    }
}
exports.IntegerControl = IntegerControl;
exports.default = renderer_util_1.registerStartupRenderer(exports.integerControlTester, inferno_redux_1.connect(base_control_1.mapStateToControlProps)(IntegerControl));
//# sourceMappingURL=integer.control.js.map