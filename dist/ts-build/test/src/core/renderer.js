"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const inferno_component_1 = require("inferno-component");
const uischema_1 = require("../models/uischema");
const path_util_1 = require("../path.util");
const index_1 = require("../reducers/index");
exports.convertToClassName = (value) => {
    let result = value.replace('#', 'root');
    result = result.replace(new RegExp('/', 'g'), '_');
    return result;
};
exports.getValue = (data, controlElement, prefix = '') => {
    if (_.isEmpty(controlElement)) {
        return undefined;
    }
    const path = _.isEmpty(prefix) ?
        controlElement.scope.$ref :
        prefix + controlElement.scope.$ref.substr(1);
    const pair = path_util_1.getValuePropertyPair(data, path);
    if (pair.property === undefined) {
        return pair.instance;
    }
    return pair.instance[pair.property];
};
class Renderer extends inferno_component_1.default {
}
exports.Renderer = Renderer;
// TODO: pass in uischema and data instead of props and state
exports.isVisible = (props, state) => {
    if (props.uischema.rule) {
        return exports.evalVisibility(props.uischema, index_1.getData(state));
    }
    return true;
};
exports.isEnabled = (props, state) => {
    if (props.uischema.rule) {
        return exports.evalEnablement(props.uischema, index_1.getData(state));
    }
    return true;
};
exports.evalVisibility = (uischema, data) => {
    // TODO condition evaluation should be done somewhere else
    if (!_.has(uischema, 'rule.condition')) {
        return true;
    }
    const condition = uischema.rule.condition;
    const ref = condition.scope.$ref;
    const pair = path_util_1.getValuePropertyPair(data, ref);
    const value = pair.instance[pair.property];
    const equals = value === condition.expectedValue;
    switch (uischema.rule.effect) {
        case uischema_1.RuleEffect.HIDE: return !equals;
        case uischema_1.RuleEffect.SHOW: return equals;
        default:
            // visible by default
            return true;
    }
};
exports.evalEnablement = (uischema, data) => {
    if (!_.has(uischema, 'rule.condition')) {
        return true;
    }
    // TODO condition evaluation should be done somewhere else
    const condition = uischema.rule.condition;
    const ref = condition.scope.$ref;
    const pair = path_util_1.getValuePropertyPair(data, ref);
    const value = pair.instance[pair.property];
    const equals = value === condition.expectedValue;
    switch (uischema.rule.effect) {
        case uischema_1.RuleEffect.DISABLE: return !equals;
        case uischema_1.RuleEffect.ENABLE: return equals;
        default:
            // enabled by default
            return true;
    }
};
//# sourceMappingURL=renderer.js.map