"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../JSX");
const testers_1 = require("../../core/testers");
const base_control_1 = require("./base.control");
const inferno_redux_1 = require("inferno-redux");
const renderer_util_1 = require("../renderer.util");
/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
exports.textControlTester = testers_1.rankWith(1, testers_1.isControl);
class TextControl extends base_control_1.BaseControl {
    constructor() {
        super(...arguments);
        this.inputChangeProperty = 'onInput';
        this.valueProperty = 'value';
    }
    toInput(value) {
        return value === undefined ? '' : value;
    }
    createInputElement() {
        return JSX_1.JSX.createElement("input", Object.assign({}, this.createProps()));
    }
}
exports.TextControl = TextControl;
exports.default = renderer_util_1.registerStartupRenderer(exports.textControlTester, inferno_redux_1.connect(base_control_1.mapStateToControlProps)(TextControl));
//# sourceMappingURL=text.control.js.map