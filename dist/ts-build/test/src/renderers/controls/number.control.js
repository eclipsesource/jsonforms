"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../JSX");
const _ = require("lodash");
const testers_1 = require("../../core/testers");
const base_control_1 = require("./base.control");
const inferno_redux_1 = require("inferno-redux");
const renderer_util_1 = require("../renderer.util");
/**
 * Default tester for number controls.
 * @type {RankedTester}
 */
exports.numberControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaTypeIs('number')));
class NumberControl extends base_control_1.BaseControl {
    constructor() {
        super(...arguments);
        this.inputChangeProperty = 'onInput';
        this.valueProperty = 'value';
    }
    /**
     * @inheritDoc
     */
    createInputElement() {
        return (JSX_1.JSX.createElement("input", Object.assign({ type: 'number' }, this.createProps([], {
            step: 0.1
        }))));
    }
    /**
     * @inheritDoc
     */
    toModel(value) {
        return _.toNumber(value);
    }
    /**
     * @inheritDoc
     */
    toInput(value) {
        return value === undefined || value === null ? undefined : value;
    }
}
exports.NumberControl = NumberControl;
exports.default = renderer_util_1.registerStartupRenderer(exports.numberControlTester, inferno_redux_1.connect(base_control_1.mapStateToControlProps)(NumberControl));
//# sourceMappingURL=number.control.js.map