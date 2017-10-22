"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../JSX");
const testers_1 = require("../../core/testers");
const base_control_1 = require("./base.control");
const inferno_redux_1 = require("inferno-redux");
const renderer_util_1 = require("../renderer.util");
/**
 * Tester for a multi-line string control.
 * @type {RankedTester}
 */
exports.textAreaControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.optionIs('multi', true)));
class TextAreaControl extends base_control_1.BaseControl {
    constructor() {
        super(...arguments);
        this.inputChangeProperty = 'onInput';
        this.valueProperty = 'value';
    }
    createInputElement() {
        return (JSX_1.JSX.createElement("textarea", Object.assign({}, this.createProps())));
    }
    /**
     * @inheritDoc
     */
    toInput(value) {
        return (value === undefined || value === null) ? '' : value;
    }
}
exports.TextAreaControl = TextAreaControl;
exports.default = renderer_util_1.registerStartupRenderer(exports.textAreaControlTester, inferno_redux_1.connect(base_control_1.mapStateToControlProps)(TextAreaControl));
//# sourceMappingURL=textarea.control.js.map