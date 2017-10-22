"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../JSX");
const testers_1 = require("../../core/testers");
const base_control_1 = require("./base.control");
const inferno_redux_1 = require("inferno-redux");
const renderer_util_1 = require("../renderer.util");
/**
 * Default tester for date controls.
 * @type {RankedTester}
 */
exports.dateControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.formatIs('date')));
class DateControl extends base_control_1.BaseControl {
    constructor() {
        super(...arguments);
        this.inputChangeProperty = 'oninput';
        this.valueProperty = 'value';
    }
    createInputElement() {
        return (JSX_1.JSX.createElement("input", Object.assign({ type: 'date' }, this.createProps())));
    }
    /**
     * @inheritDoc
     */
    toInput(value) {
        return new Date(value);
    }
    /**
     * @inheritDoc
     */
    toModel(value) {
        if (value === null || value === undefined) {
            return undefined;
        }
        return new Date(value).toISOString().substr(0, 10);
    }
}
exports.DateControl = DateControl;
exports.default = renderer_util_1.registerStartupRenderer(exports.dateControlTester, inferno_redux_1.connect(base_control_1.mapStateToControlProps)(DateControl));
//# sourceMappingURL=date.control.js.map