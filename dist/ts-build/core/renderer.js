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
var _ = require("lodash");
var inferno_component_1 = require("inferno-component");
var uischema_1 = require("../models/uischema");
var path_util_1 = require("../path.util");
var index_1 = require("../reducers/index");
exports.convertToClassName = function (value) {
    var result = value.replace('#', 'root');
    result = result.replace(new RegExp('/', 'g'), '_');
    return result;
};
exports.getValue = function (data, controlElement, prefix) {
    if (prefix === void 0) { prefix = ''; }
    if (_.isEmpty(controlElement)) {
        return undefined;
    }
    var path = _.isEmpty(prefix) ?
        controlElement.scope.$ref :
        prefix + controlElement.scope.$ref.substr(1);
    var pair = path_util_1.getValuePropertyPair(data, path);
    if (pair.property === undefined) {
        return pair.instance;
    }
    return pair.instance[pair.property];
};
var Renderer = /** @class */ (function (_super) {
    __extends(Renderer, _super);
    function Renderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Renderer;
}(inferno_component_1.default));
exports.Renderer = Renderer;
// TODO: pass in uischema and data instead of props and state
exports.isVisible = function (props, state) {
    if (props.uischema.rule) {
        return exports.evalVisibility(props.uischema, index_1.getData(state));
    }
    return true;
};
exports.isEnabled = function (props, state) {
    if (props.uischema.rule) {
        return exports.evalEnablement(props.uischema, index_1.getData(state));
    }
    return true;
};
exports.evalVisibility = function (uischema, data) {
    // TODO condition evaluation should be done somewhere else
    if (!_.has(uischema, 'rule.condition')) {
        return true;
    }
    var condition = uischema.rule.condition;
    var ref = condition.scope.$ref;
    var pair = path_util_1.getValuePropertyPair(data, ref);
    var value = pair.instance[pair.property];
    var equals = value === condition.expectedValue;
    switch (uischema.rule.effect) {
        case uischema_1.RuleEffect.HIDE: return !equals;
        case uischema_1.RuleEffect.SHOW: return equals;
        default:
            // visible by default
            return true;
    }
};
exports.evalEnablement = function (uischema, data) {
    if (!_.has(uischema, 'rule.condition')) {
        return true;
    }
    // TODO condition evaluation should be done somewhere else
    var condition = uischema.rule.condition;
    var ref = condition.scope.$ref;
    var pair = path_util_1.getValuePropertyPair(data, ref);
    var value = pair.instance[pair.property];
    var equals = value === condition.expectedValue;
    switch (uischema.rule.effect) {
        case uischema_1.RuleEffect.DISABLE: return !equals;
        case uischema_1.RuleEffect.ENABLE: return equals;
        default:
            // enabled by default
            return true;
    }
};
//# sourceMappingURL=renderer.js.map