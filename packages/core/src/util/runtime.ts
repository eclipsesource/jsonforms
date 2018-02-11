import * as _ from 'lodash';
// TODO: pass in uischema and data instead of props and state
import { getData } from '../reducers';
import { LeafCondition, RuleEffect, UISchemaElement } from '../models/uischema';
import { resolveData } from './resolvers';
import { toDataPath } from './path';

export const evalVisibility = (uischema: UISchemaElement, data: any) => {
  // TODO condition evaluation should be done somewhere else
  if (!_.has(uischema, 'rule.condition')) {
    return true;
  }
  const condition = uischema.rule.condition as LeafCondition;
  const value = resolveData(data, toDataPath(condition.scope));
  const equals = value === condition.expectedValue;

  switch (uischema.rule.effect) {
    case RuleEffect.HIDE: return !equals;
    case RuleEffect.SHOW: return equals;
    default:
    // visible by default
    return true;
  }
};

export const evalEnablement = (uischema: UISchemaElement, data: any) => {

  if (!_.has(uischema, 'rule.condition')) {
    return true;
  }

  const condition = uischema.rule.condition as LeafCondition;
  const value = resolveData(data, toDataPath(condition.scope));
  const equals = value === condition.expectedValue;

  switch (uischema.rule.effect) {
    case RuleEffect.DISABLE: return !equals;
    case RuleEffect.ENABLE: return equals;
    default:
    // enabled by default
    return true;
  }
};

export const isVisible = (props, state) => {

  if (props.uischema.rule) {
    return evalVisibility(props.uischema, getData(state));
  }

  return true;
};

export const isEnabled = (props, state) => {

  if (props.uischema.rule) {
    return evalEnablement(props.uischema, getData(state));
  }

  return true;
};
