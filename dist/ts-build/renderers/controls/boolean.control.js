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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var JSX_1 = require("../JSX");
var testers_1 = require("../../core/testers");
var base_control_1 = require("./base.control");
var inferno_redux_1 = require("inferno-redux");
var renderer_util_1 = require("../renderer.util");
/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
exports.booleanControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaTypeIs('boolean')));
var BooleanControl = /** @class */ (function (_super) {
    __extends(BooleanControl, _super);
    function BooleanControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inputChangeProperty = 'onClick';
        _this.valueProperty = 'checked';
        return _this;
    }
    BooleanControl.prototype.createInputElement = function () {
        var props = this.createProps();
        props.checked = this.props.data;
        return JSX_1.JSX.createElement("input", __assign({ type: 'checkbox' }, props));
    };
    return BooleanControl;
}(base_control_1.BaseControl));
exports.BooleanControl = BooleanControl;
exports.default = renderer_util_1.registerStartupRenderer(exports.booleanControlTester, inferno_redux_1.connect(base_control_1.mapStateToControlProps)(BooleanControl));
//# sourceMappingURL=boolean.control.js.map